import type { SkillFormValues, SkillGroup } from '@/model/skill'
import { useForm } from 'vee-validate'
import { createSkillApi, updateSkillApi } from '@/api/skill-service'
import { createDefaultSkillFormValues, skillSchema } from '@/schemas/skill'

export function useSkillFormDialog (options: {
  props: {
    modelValue: boolean
    mode: 'create' | 'edit'
    skill?: SkillGroup | null
  }
  emit: {
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', skill: SkillGroup): void
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
    validateField,
  } = useForm({
    validationSchema: skillSchema,
    initialValues: createDefaultSkillFormValues(),
  })

  const [name, nameProps] = defineField('name')
  const [is_active, isActiveProps] = defineField('is_active')
  const [skills] = defineField('skills')

  watch(
    () => options.props.modelValue,
    value => {
      if (value) {
        initializeForm()
      }
    },
  )

  watch(
    () => options.props.skill,
    () => {
      if (options.props.modelValue && options.props.mode === 'edit') {
        initializeForm()
      }
    },
  )

  function normalizeSkills (value: string[]): Array<{ name: string }> {
    const cleaned = value
      .map(v => (typeof v === 'string' ? v.trim() : ''))
      .filter(v => v.length > 0)

    const unique: string[] = []
    for (const item of cleaned) {
      if (!unique.some(existing => existing.toLowerCase() === item.toLowerCase())) {
        unique.push(item)
      }
    }

    return unique.map(name => ({ name }))
  }

  function initializeForm (): void {
    if (options.props.mode === 'create') {
      resetForm({
        values: createDefaultSkillFormValues(),
      })
      return
    }

    if (!options.props.skill) {
      resetForm({
        values: createDefaultSkillFormValues(),
      })
      return
    }

    let sortedSkills: typeof options.props.skill.skills = []
    if (Array.isArray(options.props.skill.skills)) {
      sortedSkills = options.props.skill.skills.reduce<typeof options.props.skill.skills>((acc, skill) => {
        const insertIndex = acc.findIndex(item => {
          if (item.display_order !== skill.display_order) {
            return item.display_order > skill.display_order
          }

          return item.id > skill.id
        })

        if (insertIndex === -1) {
          acc.push(skill)
          return acc
        }

        acc.splice(insertIndex, 0, skill)
        return acc
      }, [])
    }

    setValues({
      name: options.props.skill.name,
      is_active: options.props.skill.is_active,
      skills: sortedSkills.map(item => item.name),
    } satisfies SkillFormValues)
  }

  function onCancel (): void {
    internalModel.value = false
  }

  const onSubmit = handleSubmit(values => {
    const payload = {
      name: values.name.trim(),
      is_active: values.is_active,
      skills: normalizeSkills(values.skills),
    }

    if (options.props.mode === 'create') {
      return createSkillApi(payload).then(response => {
        options.emit('created', response.data.data)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save skill group', error)
        options.emit('failed', extractFormErrors(error))
      })
    }

    if (!options.props.skill) {
      return Promise.resolve()
    }

    return updateSkillApi(options.props.skill.id, payload).then(response => {
      options.emit('updated', response.data.data)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save skill group', error)
      options.emit('failed', extractFormErrors(error))
    })
  })

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return ['Terjadi kesalahan saat menyimpan data skills.']
    }

    if (!('isAxiosError' in error)) {
      return ['Terjadi kesalahan saat menyimpan data skills.']
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

    return ['Terjadi kesalahan saat menyimpan data skills.']
  }

  return {
    internalModel,
    errors,
    isSubmitting,
    validateField,
    setValues,
    name,
    nameProps,
    is_active,
    isActiveProps,
    skills,
    onCancel,
    onSubmit,
  }
}
