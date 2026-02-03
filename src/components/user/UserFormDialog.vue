<template>
  <v-dialog
    v-model="internalModel"
    max-width="480"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ props.mode === 'create' ? 'Tambah Pengguna' : 'Edit Pengguna' }}
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="email"
          :autocomplete="props.mode === 'create' ? 'off' : undefined"
          :bg-color="props.mode === 'edit' ? 'grey-lighten-3' : undefined"
          class="mb-4"
          :data-test="props.mode === 'create' ? 'create-email' : 'edit-email'"
          density="compact"
          :error-messages="errors.email ? [errors.email] : []"
          label="Email"
          :readonly="props.mode === 'edit'"
          type="email"
          variant="outlined"
          v-bind="emailProps"
        />

        <v-text-field
          v-model="name"
          class="mb-2"
          :data-test="props.mode === 'create' ? 'create-name' : 'edit-name'"
          density="compact"
          :error-messages="errors.name ? [errors.name] : []"
          label="Nama"
          variant="outlined"
          v-bind="nameProps"
        />

        <v-switch
          v-if="props.mode === 'create'"
          v-model="status"
          class="mt-2"
          color="primary"
          hide-details
          inset
          label="Aktif"
          v-bind="statusProps"
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="secondary"
          variant="text"
          @click="onCancel"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          :data-test="props.mode === 'create' ? 'create-submit' : 'edit-submit'"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          variant="flat"
          @click="onSubmit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { User } from '@/model/user'
  import { useForm } from 'vee-validate'
  import { createUserApi, updateUserApi } from '@/api/user-service'
  import { createDefaultUserFormValues, userSchema } from '@/schemas/user'

  const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    user?: User | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', user: User): void
    (e: 'failed', errors: string[]): void
  }>()

  const internalModel = computed({
    get () {
      return props.modelValue
    },
    set (value: boolean) {
      emit('update:modelValue', value)
    },
  })

  const {
    defineField,
    errors,
    handleSubmit,
    isSubmitting,
    resetForm,
    setValues,
  } = useForm({
    validationSchema: userSchema,
    initialValues: createDefaultUserFormValues(),
  })

  const [email, emailProps] = defineField('email')
  const [name, nameProps] = defineField('name')
  const [status, statusProps] = defineField('status')

  watch(
    () => props.modelValue,
    value => {
      if (value) {
        initializeForm()
      }
    },
  )

  watch(
    () => props.user,
    () => {
      if (props.modelValue && props.mode === 'edit') {
        initializeForm()
      }
    },
  )

  function initializeForm (): void {
    if (props.mode === 'create') {
      resetForm({
        values: createDefaultUserFormValues(),
      })
      return
    }

    if (!props.user) {
      resetForm({
        values: createDefaultUserFormValues(),
      })
      return
    }

    setValues({
      email: props.user.email,
      name: props.user.name,
      status: props.user.status,
    })
  }

  function onCancel (): void {
    internalModel.value = false
  }

  const onSubmit = handleSubmit(values => {
    if (props.mode === 'create') {
      return createUserApi({
        email: values.email,
        name: values.name,
        status: values.status,
      }).then(response => {
        const createdUser = response.data.data

        emit('created', createdUser)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save user', error)
        emit('failed', extractFormErrors(error))
      })
    }

    if (!props.user) {
      return Promise.resolve()
    }

    const id = props.user.id

    return updateUserApi(id, {
      name: values.name,
    }).then(response => {
      const updatedUser = response.data.data

      emit('updated', updatedUser)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save user', error)
      emit('failed', extractFormErrors(error))
    })
  })

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return ['Terjadi kesalahan saat menyimpan data pengguna.']
    }

    if (!('isAxiosError' in error)) {
      return ['Terjadi kesalahan saat menyimpan data pengguna.']
    }

    const axiosError = error as { formErrors?: string[], response?: { data?: { errors?: string[] } } }

    if (Array.isArray(axiosError.formErrors) && axiosError.formErrors.length > 0) {
      return axiosError.formErrors
    }

    const data = axiosError.response?.data
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
    }

    return ['Terjadi kesalahan saat menyimpan data pengguna.']
  }
</script>
