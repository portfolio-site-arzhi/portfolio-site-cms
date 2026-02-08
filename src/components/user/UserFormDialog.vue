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
  import { useUserFormDialog } from '@/logic/users/use-user-form-dialog'

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

  const {
    internalModel,
    errors,
    isSubmitting,
    setValues,
    email,
    emailProps,
    name,
    nameProps,
    status,
    statusProps,
    onCancel,
    onSubmit,
  } = useUserFormDialog({
    props,
    emit,
  })

  defineExpose({
    setValues,
  })
</script>
