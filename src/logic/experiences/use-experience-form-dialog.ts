import type { Experience, ExperienceFormValues } from '@/model/experience'
import { useForm } from 'vee-validate'
import { createExperienceApi, updateExperienceApi } from '@/api/experience-service'
import { createDefaultExperienceFormValues, experienceSchema } from '@/schemas/experience'

export function useExperienceFormDialog (options: {
  props: {
    modelValue: boolean
    mode: 'create' | 'edit'
    experience?: Experience | null
  }
  emit: {
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', experience: Experience): void
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
    validateField,
  } = useForm({
    validationSchema: experienceSchema,
    initialValues: createDefaultExperienceFormValues(),
  })

  const [is_published, isPublishedProps] = defineField('is_published')
  const [role_id, roleIdProps] = defineField('role_id')
  const [role_en, roleEnProps] = defineField('role_en')
  const [company_name, companyNameProps] = defineField('company_name')
  const [company_url, companyUrlProps] = defineField('company_url')
  const [year_start, yearStartProps] = defineField('year_start')
  const [year_end, yearEndProps] = defineField('year_end')
  const [is_current, isCurrentProps] = defineField('is_current')
  const [description_id] = defineField('description_id')
  const [description_en] = defineField('description_en')
  const [skills] = defineField('skills')

  watch(is_current, value => {
    if (value) {
      year_end.value = ''
      validateField('year_end')
    }
  })

  watch(
    () => options.props.modelValue,
    value => {
      if (value) {
        initializeForm()
      }
    },
  )

  watch(
    () => options.props.experience,
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

  function toNullableYear (value: string): number | null {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    const numeric = Number(trimmed)
    if (!Number.isFinite(numeric)) {
      return null
    }
    return Math.trunc(numeric)
  }

  function normalizeSkills (value: string[]): Array<{ skill_name: string }> {
    const cleaned = value
      .map(v => (typeof v === 'string' ? v.trim() : ''))
      .filter(v => v.length > 0)

    const unique: string[] = []
    for (const item of cleaned) {
      if (!unique.includes(item)) {
        unique.push(item)
      }
    }

    return unique.map(skill_name => ({ skill_name }))
  }

  function initializeForm (): void {
    activeLocale.value = 'id'

    if (options.props.mode === 'create') {
      resetForm({
        values: createDefaultExperienceFormValues(),
      })
      return
    }

    if (!options.props.experience) {
      resetForm({
        values: createDefaultExperienceFormValues(),
      })
      return
    }

    let sortedSkills: typeof options.props.experience.skills = []
    if (Array.isArray(options.props.experience.skills)) {
      sortedSkills = options.props.experience.skills.reduce<typeof options.props.experience.skills>((acc, skill) => {
        const insertIndex = acc.findIndex(item => item.sort > skill.sort)

        if (insertIndex === -1) {
          acc.push(skill)
          return acc
        }

        acc.splice(insertIndex, 0, skill)
        return acc
      }, [])
    }

    setValues({
      is_published: options.props.experience.is_published,
      role_id: options.props.experience.role_id,
      role_en: options.props.experience.role_en,
      company_name: options.props.experience.company_name,
      company_url: options.props.experience.company_url ?? '',
      year_start: options.props.experience.year_start === null
        ? ''
        : String(options.props.experience.year_start),
      year_end: options.props.experience.year_end === null
        ? ''
        : String(options.props.experience.year_end),
      is_current: options.props.experience.is_current,
      description_id: options.props.experience.description_id,
      description_en: options.props.experience.description_en,
      skills: sortedSkills.map(skill => skill.skill_name),
    } satisfies ExperienceFormValues)
  }

  function onCancel (): void {
    internalModel.value = false
  }

  const onSubmit = handleSubmit(values => {
    const payload = {
      is_published: values.is_published,
      role_id: values.role_id.trim(),
      role_en: values.role_en.trim(),
      company_name: values.company_name.trim(),
      company_url: toNullableString(values.company_url),
      year_start: toNullableYear(values.year_start),
      year_end: values.is_current ? null : toNullableYear(values.year_end),
      is_current: values.is_current,
      description_id: values.description_id,
      description_en: values.description_en,
      skills: normalizeSkills(values.skills),
    }

    if (options.props.mode === 'create') {
      return createExperienceApi(payload).then(response => {
        options.emit('created', response.data.data)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save experience', error)
        options.emit('failed', extractFormErrors(error))
      })
    }

    if (!options.props.experience) {
      return Promise.resolve()
    }

    return updateExperienceApi(options.props.experience.id, payload).then(response => {
      options.emit('updated', response.data.data)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save experience', error)
      options.emit('failed', extractFormErrors(error))
    })
  })

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return ['Terjadi kesalahan saat menyimpan data experience.']
    }

    if (!('isAxiosError' in error)) {
      return ['Terjadi kesalahan saat menyimpan data experience.']
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

    return ['Terjadi kesalahan saat menyimpan data experience.']
  }

  return {
    internalModel,
    activeLocale,
    errors,
    isSubmitting,
    validateField,
    setValues,
    is_published,
    isPublishedProps,
    role_id,
    roleIdProps,
    role_en,
    roleEnProps,
    company_name,
    companyNameProps,
    company_url,
    companyUrlProps,
    year_start,
    yearStartProps,
    year_end,
    yearEndProps,
    is_current,
    isCurrentProps,
    description_id,
    description_en,
    skills,
    onCancel,
    onSubmit,
  }
}
