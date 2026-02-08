import type { User, UserFormValues } from '@/model/user'
import { useForm } from 'vee-validate'
import { createUserApi, updateUserApi } from '@/api/user-service'
import { createDefaultUserFormValues, userSchema } from '@/schemas/user'

export function useUserFormDialog (options: {
  props: {
    modelValue: boolean
    mode: 'create' | 'edit'
    user?: User | null
  }
  emit: {
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', user: User): void
    (e: 'failed', errors: string[]): void
  }
}) {
  const internalModel = computed({
    get () {
      return options.props.modelValue
    },
    set (value: boolean) {
      options.emit('update:modelValue', value)
    },
  })

  const {
    defineField,
    errors,
    handleSubmit,
    isSubmitting,
    resetForm,
    setValues,
  } = useForm<UserFormValues>({
    validationSchema: userSchema,
    initialValues: createDefaultUserFormValues(),
  })

  const [email, emailProps] = defineField('email')
  const [name, nameProps] = defineField('name')
  const [status, statusProps] = defineField('status')

  watch(
    () => options.props.modelValue,
    value => {
      if (value) {
        initializeForm()
      }
    },
  )

  watch(
    () => options.props.user,
    () => {
      if (options.props.modelValue && options.props.mode === 'edit') {
        initializeForm()
      }
    },
  )

  function initializeForm (): void {
    if (options.props.mode === 'create') {
      resetForm({
        values: createDefaultUserFormValues(),
      })
      return
    }

    if (!options.props.user) {
      resetForm({
        values: createDefaultUserFormValues(),
      })
      return
    }

    setValues({
      email: options.props.user.email,
      name: options.props.user.name,
      status: options.props.user.status,
    })
  }

  function onCancel (): void {
    internalModel.value = false
  }

  const onSubmit = handleSubmit(values => {
    if (options.props.mode === 'create') {
      return createUserApi({
        email: values.email,
        name: values.name,
        status: values.status,
      }).then(response => {
        const createdUser = response.data.data

        options.emit('created', createdUser)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save user', error)
        options.emit('failed', extractFormErrors(error))
      })
    }

    if (!options.props.user) {
      return Promise.resolve()
    }

    const id = options.props.user.id

    return updateUserApi(id, {
      name: values.name,
    }).then(response => {
      const updatedUser = response.data.data

      options.emit('updated', updatedUser)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save user', error)
      options.emit('failed', extractFormErrors(error))
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

  return {
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
  }
}
