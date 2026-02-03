<template>
  <v-container
    class="py-6"
    fluid
  >
    <v-row class="mb-4" no-gutters>
      <v-col
        class="mb-4"
        cols="12"
      >
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-4">
          <div class="mb-4 mb-sm-0">
            <div class="text-h5 font-weight-medium mb-1">
              Konfigurasi Website
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Atur tampilan global, konten beranda, tentang kami, dan footer.
            </div>
          </div>
          <v-btn
            color="primary"
            :loading="isSubmitting"
            prepend-icon="mdi-content-save"
            variant="flat"
            @click="confirmSave"
          >
            Simpan Perubahan
          </v-btn>
        </div>

        <v-alert
          v-if="loadError"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          {{ loadError }}
        </v-alert>
        <v-alert
          v-if="saveErrors.length > 0"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          <div
            v-for="err in saveErrors"
            :key="err"
          >
            {{ err }}
          </div>
        </v-alert>

        <v-card :loading="loading">
          <v-tabs
            v-model="activeTab"
            bg-color="primary"
            grow
            :mobile="isMobile"
            :show-arrows="isMobile ? 'always' : false"
          >
            <v-tab value="system">
              <v-icon class="mr-2">
                mdi-cog
              </v-icon>
              System
            </v-tab>
            <v-tab value="home">
              <v-icon class="mr-2">
                mdi-home
              </v-icon>
              Home
            </v-tab>
            <v-tab value="about">
              <v-icon class="mr-2">
                mdi-information
              </v-icon>
              About
            </v-tab>
            <v-tab value="footer">
              <v-icon class="mr-2">
                mdi-page-layout-footer
              </v-icon>
              Footer
            </v-tab>
          </v-tabs>

          <v-card-text class="py-6">
            <v-window v-model="activeTab">
              <!-- SYSTEM TAB -->
              <v-window-item value="system">
                <SystemTab
                  v-model="system"
                  :errors="errors"
                  :validate-field="validateField as unknown as (path: string) => unknown"
                />
              </v-window-item>

              <!-- HOME TAB -->
              <v-window-item value="home">
                <HomeTab
                  v-model="home"
                  v-model:file="homeFile"
                  :errors="errors"
                  :validate-field="validateField as unknown as (path: string) => unknown"
                />
              </v-window-item>

              <!-- ABOUT TAB -->
              <v-window-item value="about">
                <AboutTab
                  v-model="about"
                  :errors="errors"
                  :validate-field="validateField as unknown as (path: string) => unknown"
                />
              </v-window-item>

              <!-- FOOTER TAB -->
              <v-window-item value="footer">
                <FooterTab
                  v-model="footer"
                  :errors="errors"
                  :validate-field="validateField as unknown as (path: string) => unknown"
                />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <ConfirmDialog
      v-model="saveDialog"
      cancel-text="Batal"
      confirm-color="primary"
      confirm-text="Ya, Simpan"
      message="Apakah Anda yakin ingin menyimpan perubahan konfigurasi ini?"
      title="Konfirmasi Simpan"
      @confirm="onSave"
    />

  </v-container>
</template>

<script lang="ts" setup>
  import type { AxiosError } from 'axios'
  import { useForm } from 'vee-validate'
  import { useDisplay } from 'vuetify'
  import { saveSiteConfigsBulkApi } from '@/api/site-config-service'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import AboutTab from '@/components/site-config/AboutTab.vue'
  import FooterTab from '@/components/site-config/FooterTab.vue'
  import HomeTab from '@/components/site-config/HomeTab.vue'
  import SystemTab from '@/components/site-config/SystemTab.vue'
  import { createDefaultSiteConfigFormValues, siteConfigSchema } from '@/schemas/site-config'
  import { useAppStore } from '@/stores/app'
  import { useSiteConfigStore } from '@/stores/site-config'

  // State
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

  // Form Data
  const {
    values: form,
    errors,
    handleSubmit,
    setValues,
    defineField,
    validateField,
    setFieldValue,
  } = useForm({
    validationSchema: siteConfigSchema,
    initialValues: createDefaultSiteConfigFormValues(),
  })

  const [system] = defineField('system')
  const [home] = defineField('home')
  const [about] = defineField('about')
  const [footer] = defineField('footer')

  // Register nested fields so validateField(path) works tanpa warning
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

  // Lifecycle
  onMounted(() => {
    loadData()
  })

  // Methods
  defineExpose({ form, errors, validateField, setFieldValue })
  async function loadData () {
    loading.value = true
    loadError.value = null

    try {
      await siteConfigStore.fetchSiteConfigs(true)

      // Populate form from store
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
    } catch (error) {
      console.error('Failed to load site configs', error)
      loadError.value = 'Gagal memuat konfigurasi. Silakan refresh halaman.'
    } finally {
      loading.value = false
    }
  }

  const confirmSave = handleSubmit(() => {
    saveDialog.value = true
  }, () => {
    appStore.showError('Mohon periksa kembali inputan anda')
  })

  function onSave () {
    isSubmitting.value = true
    saveDialog.value = false
    saveErrors.value = []

    saveSiteConfigsBulkApi(form, homeFile.value)
      .then(() => {
        appStore.showSuccess('Konfigurasi berhasil disimpan')
        saveErrors.value = []
        siteConfigStore.fetchSiteConfigs(true)
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
</script>
