import type { AxiosError } from 'axios'
import type { SiteConfigFormValues } from '@/model/site-config'
import { useForm } from 'vee-validate'
import { useDisplay } from 'vuetify'
import { saveSiteConfigsBulkApi } from '@/api/site-config-service'
import { createDefaultSiteConfigFormValues, siteConfigSchema } from '@/schemas/site-config'
import { useAppStore } from '@/stores/app'
import { useSiteConfigStore } from '@/stores/site-config'

export function useSiteConfigurationsPage () {
  const siteConfigStore = useSiteConfigStore()
  const appStore = useAppStore()
  const display = useDisplay()

  const activeTab = ref('system')
  const loading = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref<string | null>(null)
  const saveErrors = ref<string[]>([])
  const saveDialog = ref(false)
  const homeFile = ref<File | null>(null)

  const isMobile = computed(() => display.smAndDown.value)

  const {
    values: form,
    errors,
    handleSubmit,
    setValues,
    defineField,
    validateField,
    setFieldValue,
  } = useForm<SiteConfigFormValues>({
    validationSchema: siteConfigSchema,
    initialValues: createDefaultSiteConfigFormValues(),
  })

  const [system] = defineField('system')
  const [home] = defineField('home')
  const [about] = defineField('about')
  const [footer] = defineField('footer')

  defineField('system.primary_color')
  defineField('system.secondary_color')

  defineField('home.name')
  defineField('home.position')
  defineField('home.description.id')
  defineField('home.description.en')

  defineField('about.email')
  defineField('about.about_me.id')
  defineField('about.about_me.en')

  defineField('footer.github')
  defineField('footer.linkedin')
  defineField('footer.instagram')

  function loadData (): void {
    loading.value = true
    loadError.value = null

    Promise.resolve(siteConfigStore.fetchSiteConfigs(true)).then(() => {
      setValues({
        system: { ...siteConfigStore.system },
        home: {
          status_file: 0,
          name: siteConfigStore.home.name,
          position: siteConfigStore.home.position,
          description: {
            id: siteConfigStore.home.description.id,
            en: siteConfigStore.home.description.en,
          },
          photo: siteConfigStore.home.photo ?? '',
        },
        about: {
          about_me: {
            id: siteConfigStore.about.about_me.id,
            en: siteConfigStore.about.about_me.en,
          },
          email: siteConfigStore.about.email,
        },
        footer: {
          github: siteConfigStore.footer.github,
          linkedin: siteConfigStore.footer.linkedin,
          instagram: siteConfigStore.footer.instagram,
        },
      })
    }).catch(error => {
      console.error('Failed to load site configs', error)
      loadError.value = 'Gagal memuat konfigurasi. Silakan refresh halaman.'
    }).finally(() => {
      loading.value = false
    })
  }

  const confirmSave = handleSubmit(() => {
    saveDialog.value = true
  }, () => {
    appStore.showError('Mohon periksa kembali inputan anda')
  })

  function onSave (): void {
    isSubmitting.value = true
    saveDialog.value = false
    saveErrors.value = []

    saveSiteConfigsBulkApi(form, homeFile.value)
      .then(() => {
        appStore.showSuccess('Konfigurasi berhasil disimpan')
        saveErrors.value = []
        Promise.resolve(siteConfigStore.fetchSiteConfigs(true))
      })
      .catch(error => {
        console.error('Failed to save configs', error)
        const axiosError = error as AxiosError | undefined
        const status = axiosError?.response?.status
        if (status === 400) {
          return
        }
        appStore.showError('Gagal menyimpan konfigurasi.')
        const extracted = extractFormErrors(error)
        if (extracted.length > 0) {
          saveErrors.value = extracted
          return
        }
        saveErrors.value = []
      })
      .finally(() => {
        isSubmitting.value = false
      })
  }

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return []
    }

    if (!('isAxiosError' in error)) {
      return []
    }

    const axiosError = error as AxiosError & { formErrors?: string[] }

    if (Array.isArray(axiosError.formErrors)) {
      return axiosError.formErrors
    }

    const data = axiosError.response?.data as { errors?: string[] } | undefined
    if (data && Array.isArray(data.errors)) {
      return data.errors
    }

    return []
  }

  return {
    activeTab,
    loading,
    isSubmitting,
    loadError,
    saveErrors,
    saveDialog,
    homeFile,
    isMobile,
    form,
    errors,
    validateField,
    setFieldValue,
    system,
    home,
    about,
    footer,
    loadData,
    confirmSave,
    onSave,
  }
}
