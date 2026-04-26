import type {
  Portfolio,
  PortfolioFormValues,
  PortfolioStackDraft,
  PortfolioStackUpsertPayload,
} from '@/model/portfolio'
import { useForm } from 'vee-validate'
import { createPortfolioApi, updatePortfolioApi } from '@/api/portfolio-service'
import { createDefaultPortfolioFormValues, createPortfolioSchema } from '@/schemas/portfolio'

function hasRichTextContent (value: string): boolean {
  const withoutTags = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return withoutTags.length > 0
}

function toNullableString (value: string): string | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }

  return trimmed
}

function toNullableRichText (value: string): string | null {
  if (!hasRichTextContent(value)) {
    return null
  }

  return value
}

function toIsoDateTime (value: string): string | null {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return null
  }

  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

function toDateTimeInputValue (value: string | null): string {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function toRichTextEditorValue (value: string | null): string {
  if (!value || !hasRichTextContent(value)) {
    return '<p></p>'
  }

  return value
}

function sortByDisplayOrder<T extends { id: number, display_order: number }> (items: T[]): T[] {
  return items.reduce<T[]>((acc, item) => {
    const insertIndex = acc.findIndex(candidate => {
      if (candidate.display_order !== item.display_order) {
        return candidate.display_order > item.display_order
      }

      return candidate.id > item.id
    })

    if (insertIndex === -1) {
      acc.push(item)
      return acc
    }

    acc.splice(insertIndex, 0, item)
    return acc
  }, [])
}

export function usePortfolioFormDialog (options: {
  props: {
    modelValue: boolean
    mode: 'create' | 'edit'
    portfolio?: Portfolio | null
  }
  emit: {
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', portfolio: Portfolio): void
    (e: 'failed', errors: string[]): void
  }
}) {
  const activeContributionLocale = ref<'id' | 'en'>('id')
  const activeOutcomeLocale = ref<'id' | 'en'>('id')

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
    setFieldValue,
    setValues,
    validateField,
  } = useForm<PortfolioFormValues>({
    validationSchema: createPortfolioSchema(options.props.mode),
    initialValues: createDefaultPortfolioFormValues(),
  })

  const [title, titleProps] = defineField('title')
  const [description, descriptionProps] = defineField('description')
  const [description_en, descriptionEnProps] = defineField('description_en')
  const [contribution] = defineField('contribution')
  const [contribution_en] = defineField('contribution_en')
  const [outcome] = defineField('outcome')
  const [outcome_en] = defineField('outcome_en')
  const [role, roleProps] = defineField('role')
  const [live_url, liveUrlProps] = defineField('live_url')
  const [github_url, githubUrlProps] = defineField('github_url')
  const [is_published, isPublishedProps] = defineField('is_published')
  const [published_at, publishedAtProps] = defineField('published_at')
  const [image_file] = defineField('image_file')
  const [image_url] = defineField('image_url')
  const [status_file] = defineField('status_file')
  const [stacks] = defineField('stacks')

  watch(
    () => options.props.modelValue,
    value => {
      if (value) {
        initializeForm()
      }
    },
  )

  watch(
    () => options.props.portfolio,
    () => {
      if (options.props.modelValue && options.props.mode === 'edit') {
        initializeForm()
      }
    },
  )

  function normalizeStacks (value: PortfolioStackDraft[]): PortfolioStackUpsertPayload[] {
    return value
      .map(item => ({
        name: item.name.trim(),
      }))
      .filter(item => item.name.length > 0)
  }

  function initializeForm (): void {
    activeContributionLocale.value = 'id'
    activeOutcomeLocale.value = 'id'

    if (options.props.mode === 'create') {
      resetForm({
        values: createDefaultPortfolioFormValues(),
      })
      return
    }

    if (!options.props.portfolio) {
      resetForm({
        values: createDefaultPortfolioFormValues(),
      })
      return
    }

    const sortedStacks = sortByDisplayOrder(options.props.portfolio.stacks ?? [])

    setValues({
      title: options.props.portfolio.title,
      description: options.props.portfolio.description,
      description_en: options.props.portfolio.description_en ?? '',
      contribution: toRichTextEditorValue(options.props.portfolio.contribution),
      contribution_en: toRichTextEditorValue(options.props.portfolio.contribution_en),
      outcome: toRichTextEditorValue(options.props.portfolio.outcome),
      outcome_en: toRichTextEditorValue(options.props.portfolio.outcome_en),
      role: options.props.portfolio.role ?? '',
      live_url: options.props.portfolio.live_url ?? '',
      github_url: options.props.portfolio.github_url ?? '',
      is_published: options.props.portfolio.is_published,
      published_at: toDateTimeInputValue(options.props.portfolio.published_at),
      image_file: null,
      image_url: options.props.portfolio.image,
      status_file: 0,
      stacks: sortedStacks.map(item => ({
        id: item.id,
        name: item.name,
      })),
    } satisfies PortfolioFormValues)
  }

  function onCancel (): void {
    internalModel.value = false
  }

  function onImageChange (file: File | null): void {
    image_file.value = file
    status_file.value = 1

    validateField('image_file')
  }

  function onImageRemove (): void {
    image_file.value = null
    image_url.value = null
    status_file.value = 1

    validateField('image_file')
  }

  function updateStacks (value: PortfolioStackDraft[]): void {
    setFieldValue('stacks', value)
    validateField('stacks')
  }

  const onSubmit = handleSubmit(values => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      description_en: toNullableString(values.description_en),
      contribution: toNullableRichText(values.contribution),
      contribution_en: toNullableRichText(values.contribution_en),
      outcome: toNullableRichText(values.outcome),
      outcome_en: toNullableRichText(values.outcome_en),
      role: toNullableString(values.role),
      live_url: toNullableString(values.live_url),
      github_url: toNullableString(values.github_url),
      is_published: values.is_published,
      published_at: toIsoDateTime(values.published_at),
      stacks: normalizeStacks(values.stacks),
    }

    if (options.props.mode === 'create') {
      return createPortfolioApi(payload, values.image_file ?? null).then(response => {
        options.emit('created', response.data.data)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save portfolio', error)
        options.emit('failed', extractFormErrors(error))
      })
    }

    if (!options.props.portfolio) {
      return Promise.resolve()
    }

    return updatePortfolioApi(options.props.portfolio.id, {
      status_file: values.status_file,
      ...payload,
    }, values.image_file ?? null).then(response => {
      options.emit('updated', response.data.data)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save portfolio', error)
      options.emit('failed', extractFormErrors(error))
    })
  }, validationResult => {
    const nextErrors = Object.values(validationResult.errors)
      .map(value => String(value ?? '').trim())
      .filter(value => value.length > 0)

    if (nextErrors.length > 0) {
      options.emit('failed', Array.from(new Set(nextErrors)))
    }
  })

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return ['Terjadi kesalahan saat menyimpan data portfolio.']
    }

    if (!('isAxiosError' in error)) {
      return ['Terjadi kesalahan saat menyimpan data portfolio.']
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

    return ['Terjadi kesalahan saat menyimpan data portfolio.']
  }

  return {
    internalModel,
    activeContributionLocale,
    activeOutcomeLocale,
    errors,
    isSubmitting,
    setValues,
    validateField,
    title,
    titleProps,
    description,
    descriptionProps,
    description_en,
    descriptionEnProps,
    contribution,
    contribution_en,
    outcome,
    outcome_en,
    role,
    roleProps,
    live_url,
    liveUrlProps,
    github_url,
    githubUrlProps,
    is_published,
    isPublishedProps,
    published_at,
    publishedAtProps,
    image_file,
    image_url,
    stacks,
    onCancel,
    onSubmit,
    onImageChange,
    onImageRemove,
    updateStacks,
  }
}
