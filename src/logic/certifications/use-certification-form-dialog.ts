import type { Certification, CertificationFormValues } from '@/model/certification'
import { useForm } from 'vee-validate'
import { createCertificationApi, updateCertificationApi } from '@/api/certification-service'
import { certificationSchema, createDefaultCertificationFormValues } from '@/schemas/certification'

export function useCertificationFormDialog (options: {
  props: {
    modelValue: boolean
    mode: 'create' | 'edit'
    certification?: Certification | null
  }
  emit: {
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', certification: Certification): void
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

  const activeLocale = ref<'id' | 'en'>('id')

  const {
    defineField,
    errors,
    handleSubmit,
    isSubmitting,
    resetForm,
    setValues,
  } = useForm({
    validationSchema: certificationSchema,
    initialValues: createDefaultCertificationFormValues(),
  })

  const [name, nameProps] = defineField('name')
  const [name_en, nameEnProps] = defineField('name_en')
  const [issuing_organization, issuingOrganizationProps] = defineField('issuing_organization')
  const [issue_date, issueDateProps] = defineField('issue_date')
  const [description] = defineField('description')
  const [description_en] = defineField('description_en')
  const [is_active, isActiveProps] = defineField('is_active')

  watch(
    () => options.props.modelValue,
    value => {
      if (value) {
        initializeForm()
      }
    },
  )

  watch(
    () => options.props.certification,
    () => {
      if (options.props.modelValue && options.props.mode === 'edit') {
        initializeForm()
      }
    },
  )

  function toNullableString (value: string): string | null {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    return trimmed
  }

  function toIssueDatePayload (value: string): string {
    return `${value.trim()}-01`
  }

  function toIssueMonthValue (value: string): string {
    const trimmed = value.trim()
    const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(trimmed)
    if (match) {
      return `${match[1]}-${match[2]}`
    }
    return trimmed
  }

  function initializeForm (): void {
    activeLocale.value = 'id'

    if (options.props.mode === 'create') {
      resetForm({
        values: createDefaultCertificationFormValues(),
      })
      return
    }

    if (!options.props.certification) {
      resetForm({
        values: createDefaultCertificationFormValues(),
      })
      return
    }

    setValues({
      name: options.props.certification.name,
      name_en: options.props.certification.name_en,
      issuing_organization: options.props.certification.issuing_organization,
      issue_date: toIssueMonthValue(options.props.certification.issue_date),
      description: options.props.certification.description ?? '<p></p>',
      description_en: options.props.certification.description_en ?? '<p></p>',
      is_active: options.props.certification.is_active,
    } satisfies CertificationFormValues)
  }

  function onCancel (): void {
    internalModel.value = false
  }

  const onSubmit = handleSubmit(values => {
    const payload = {
      name: values.name.trim(),
      name_en: values.name_en.trim(),
      issuing_organization: values.issuing_organization.trim(),
      issue_date: toIssueDatePayload(values.issue_date),
      description: toNullableString(values.description),
      description_en: toNullableString(values.description_en),
      is_active: values.is_active,
    }

    if (options.props.mode === 'create') {
      return createCertificationApi(payload).then(response => {
        options.emit('created', response.data.data)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save certification', error)
        options.emit('failed', extractFormErrors(error))
      })
    }

    if (!options.props.certification) {
      return Promise.resolve()
    }

    return updateCertificationApi(options.props.certification.id, payload).then(response => {
      options.emit('updated', response.data.data)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save certification', error)
      options.emit('failed', extractFormErrors(error))
    })
  })

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return ['Terjadi kesalahan saat menyimpan data certification.']
    }

    if (!('isAxiosError' in error)) {
      return ['Terjadi kesalahan saat menyimpan data certification.']
    }

    const axiosError = error as {
      formErrors?: string[]
      response?: {
        data?: {
          errors?: string[]
        }
      }
    }

    if (Array.isArray(axiosError.formErrors) && axiosError.formErrors.length > 0) {
      return axiosError.formErrors
    }

    const data = axiosError.response?.data
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
    }

    return ['Terjadi kesalahan saat menyimpan data certification.']
  }

  return {
    internalModel,
    activeLocale,
    errors,
    isSubmitting,
    setValues,
    name,
    nameProps,
    name_en,
    nameEnProps,
    issuing_organization,
    issuingOrganizationProps,
    issue_date,
    issueDateProps,
    description,
    description_en,
    is_active,
    isActiveProps,
    onCancel,
    onSubmit,
  }
}
