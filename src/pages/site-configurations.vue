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
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import AboutTab from '@/components/site-config/AboutTab.vue'
  import FooterTab from '@/components/site-config/FooterTab.vue'
  import HomeTab from '@/components/site-config/HomeTab.vue'
  import SystemTab from '@/components/site-config/SystemTab.vue'
  import { useSiteConfigurationsPage } from '@/logic/site-config/use-site-configurations-page'

  const {
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
  } = useSiteConfigurationsPage()

  // Lifecycle
  onMounted(() => {
    loadData()
  })

  defineExpose({ form, errors, validateField, setFieldValue })
</script>
