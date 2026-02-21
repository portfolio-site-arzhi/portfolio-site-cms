import type { Education, EducationFormValues } from '@/model/education'
import { useForm } from 'vee-validate'
import { createEducationApi, updateEducationApi } from '@/api/education-service'
import { createDefaultEducationFormValues, educationSchema } from '@/schemas/education'

export function useEducationFormDialog (options: {
  props: {
    modelValue: boolean
    mode: 'create' | 'edit'
    education?: Education | null
  }
  emit: {
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', education: Education): void
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
    validationSchema: educationSchema,
    initialValues: createDefaultEducationFormValues(),
  })

  const [institution_name, institutionNameProps] = defineField('institution_name')
  const [degree, degreeProps] = defineField('degree')
  const [degree_en, degreeEnProps] = defineField('degree_en')
  const [field_of_study, fieldOfStudyProps] = defineField('field_of_study')
  const [field_of_study_en, fieldOfStudyEnProps] = defineField('field_of_study_en')
  const [start_date, startDateProps] = defineField('start_date')
  const [end_date, endDateProps] = defineField('end_date')
  const [description] = defineField('description')
  const [description_en] = defineField('description_en')
  const [location, locationProps] = defineField('location')
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
    () => options.props.education,
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

  function toDatePayload (value: string): string {
    return `${value.trim()}-01`
  }

  function toNullableDatePayload (value: string): string | null {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    return `${trimmed}-01`
  }

  function toMonthValue (value: string): string {
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
        values: createDefaultEducationFormValues(),
      })
      return
    }

    if (!options.props.education) {
      resetForm({
        values: createDefaultEducationFormValues(),
      })
      return
    }

    setValues({
      institution_name: options.props.education.institution_name,
      degree: options.props.education.degree,
      degree_en: options.props.education.degree_en,
      field_of_study: options.props.education.field_of_study,
      field_of_study_en: options.props.education.field_of_study_en,
      start_date: toMonthValue(options.props.education.start_date),
      end_date: options.props.education.end_date ? toMonthValue(options.props.education.end_date) : '',
      description: options.props.education.description ?? '<p></p>',
      description_en: options.props.education.description_en ?? '<p></p>',
      location: options.props.education.location ?? '',
      is_active: options.props.education.is_active,
    } satisfies EducationFormValues)
  }

  function onCancel (): void {
    internalModel.value = false
  }

  const onSubmit = handleSubmit(values => {
    const payload = {
      institution_name: values.institution_name.trim(),
      degree: values.degree.trim(),
      degree_en: values.degree_en.trim(),
      field_of_study: values.field_of_study.trim(),
      field_of_study_en: values.field_of_study_en.trim(),
      start_date: toDatePayload(values.start_date),
      end_date: toNullableDatePayload(values.end_date),
      description: toNullableString(values.description),
      description_en: toNullableString(values.description_en),
      location: toNullableString(values.location),
      is_active: values.is_active,
    }

    if (options.props.mode === 'create') {
      return createEducationApi(payload).then(response => {
        options.emit('created', response.data.data)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save education', error)
        options.emit('failed', extractFormErrors(error))
      })
    }

    if (!options.props.education) {
      return Promise.resolve()
    }

    return updateEducationApi(options.props.education.id, payload).then(response => {
      options.emit('updated', response.data.data)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save education', error)
      options.emit('failed', extractFormErrors(error))
    })
  })

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return ['Terjadi kesalahan saat menyimpan data education.']
    }

    if (!('isAxiosError' in error)) {
      return ['Terjadi kesalahan saat menyimpan data education.']
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

    return ['Terjadi kesalahan saat menyimpan data education.']
  }

  return {
    internalModel,
    activeLocale,
    errors,
    isSubmitting,
    setValues,
    institution_name,
    institutionNameProps,
    degree,
    degreeProps,
    degree_en,
    degreeEnProps,
    field_of_study,
    fieldOfStudyProps,
    field_of_study_en,
    fieldOfStudyEnProps,
    start_date,
    startDateProps,
    end_date,
    endDateProps,
    description,
    description_en,
    location,
    locationProps,
    is_active,
    isActiveProps,
    onCancel,
    onSubmit,
  }
}
