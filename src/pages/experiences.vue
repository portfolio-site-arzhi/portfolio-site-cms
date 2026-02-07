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
        <div class="mb-4">
          <div class="text-h5 font-weight-medium mb-1">
            Manajemen Experience
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Kelola pengalaman kerja yang akan ditampilkan di landing page.
          </div>
        </div>

        <div class="d-flex flex-column flex-sm-row">
          <v-text-field
            v-model="search"
            class="mb-3 mb-sm-0 mr-sm-4"
            clearable
            density="compact"
            hide-details
            placeholder="Cari experience"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            @change="refreshPage"
            @click:clear="clearSearch"
          />

          <v-btn
            class="align-self-sm-start mb-3 mb-sm-0 mr-sm-3"
            color="primary"
            data-test="save-sort"
            :disabled="isSortDisabled"
            :loading="sortLoading"
            variant="outlined"
            @click="saveSort"
          >
            <v-icon
              icon="mdi-content-save"
              start
            />
            Simpan Urutan
          </v-btn>

          <v-btn
            class="align-self-sm-start"
            color="primary"
            data-test="add-experience"
            variant="flat"
            @click="openCreateDialog"
          >
            <v-icon
              icon="mdi-plus"
              start
            />
            Tambah
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
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
          v-if="formErrors.length > 0"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          <div
            v-for="err in formErrors"
            :key="err"
          >
            {{ err }}
          </div>
        </v-alert>

        <v-alert
          v-if="sortError"
          class="mb-4"
          density="comfortable"
          type="error"
          variant="tonal"
        >
          {{ sortError }}
        </v-alert>

        <v-alert
          v-if="isSearchActive"
          class="mb-4"
          density="comfortable"
          type="info"
          variant="tonal"
        >
          Sorting dinonaktifkan saat pencarian aktif. Hapus kata kunci untuk mengubah urutan.
        </v-alert>

        <v-skeleton-loader
          v-if="loading"
          type="table"
        />

        <template v-else>
          <v-card
            v-if="smAndDown"
            elevation="0"
            variant="outlined"
          >
            <draggable
              v-model="experiences"
              :disabled="isSortDisabled"
              handle=".drag-handle"
              item-key="id"
              @end="onDragEnd"
              @start="onDragStart"
            >
              <template #item="{ element }">
                <div class="px-4 py-3 d-flex align-center border-b">
                  <v-btn
                    class="drag-handle mr-3"
                    :disabled="isSortDisabled"
                    icon
                    size="small"
                    variant="text"
                  >
                    <v-icon icon="mdi-drag" />
                  </v-btn>

                  <div class="flex-grow-1">
                    <div class="font-weight-medium">
                      {{ element.company_name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ element.role_id }} · {{ element.role_en }} · {{ formatYears(element) }}
                    </div>
                    <div class="mt-2">
                      <v-chip
                        :color="element.is_published ? 'success' : 'warning'"
                        label
                        size="x-small"
                      >
                        {{ element.is_published ? 'Published' : 'Draft' }}
                      </v-chip>
                    </div>
                  </div>

                  <v-menu location="bottom end">
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        :disabled="loadingExperienceId === element.id || isSortDisabled"
                        icon
                        :loading="loadingExperienceId === element.id"
                        variant="text"
                      >
                        <v-icon icon="mdi-dots-vertical" />
                      </v-btn>
                    </template>

                    <v-list density="compact">
                      <v-list-item @click="openEditDialog(element)">
                        <v-list-item-title>
                          Edit
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="openStatusDialog(element)">
                        <v-list-item-title>
                          {{ element.is_published ? 'Jadikan Draft' : 'Publish' }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="openDeleteDialog(element)">
                        <v-list-item-title class="text-error">
                          Hapus
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </draggable>

            <div
              v-if="experiences.length === 0"
              class="text-center text-medium-emphasis py-6"
            >
              Belum ada data experience.
            </div>
          </v-card>

          <v-card
            v-else
            elevation="0"
            variant="outlined"
          >
            <v-table density="compact">
              <thead>
                <tr>
                  <th style="width: 44px" />
                  <th>
                    Perusahaan
                  </th>
                  <th>
                    Role (ID / EN)
                  </th>
                  <th style="width: 160px">
                    Periode
                  </th>
                  <th style="width: 120px">
                    Status
                  </th>
                  <th style="width: 64px" />
                </tr>
              </thead>

              <draggable
                v-model="experiences"
                :disabled="isSortDisabled"
                handle=".drag-handle"
                item-key="id"
                tag="tbody"
                @end="onDragEnd"
                @start="onDragStart"
              >
                <template #item="{ element }">
                  <tr>
                    <td>
                      <v-btn
                        class="drag-handle"
                        :disabled="isSortDisabled"
                        icon
                        size="small"
                        variant="text"
                      >
                        <v-icon icon="mdi-drag" />
                      </v-btn>
                    </td>
                    <td>
                      <div class="font-weight-medium">
                        {{ element.company_name }}
                      </div>
                      <div
                        v-if="element.company_url"
                        class="text-caption text-medium-emphasis"
                      >
                        {{ element.company_url }}
                      </div>
                    </td>
                    <td>
                      <div class="font-weight-medium">
                        {{ element.role_id }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ element.role_en }}
                      </div>
                    </td>
                    <td>
                      {{ formatYears(element) }}
                    </td>
                    <td>
                      <v-chip
                        :color="element.is_published ? 'success' : 'warning'"
                        label
                        size="small"
                      >
                        {{ element.is_published ? 'Published' : 'Draft' }}
                      </v-chip>
                    </td>
                    <td>
                      <v-menu location="bottom end">
                        <template #activator="{ props }">
                          <v-btn
                            v-bind="props"
                            :disabled="loadingExperienceId === element.id || isSortDisabled"
                            icon
                            :loading="loadingExperienceId === element.id"
                            variant="text"
                          >
                            <v-icon icon="mdi-dots-vertical" />
                          </v-btn>
                        </template>

                        <v-list density="compact">
                          <v-list-item @click="openEditDialog(element)">
                            <v-list-item-title>
                              Edit
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="openStatusDialog(element)">
                            <v-list-item-title>
                              {{ element.is_published ? 'Jadikan Draft' : 'Publish' }}
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="openDeleteDialog(element)">
                            <v-list-item-title class="text-error">
                              Hapus
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </td>
                  </tr>
                </template>
              </draggable>
            </v-table>

            <div
              v-if="experiences.length === 0"
              class="text-center text-medium-emphasis py-6"
            >
              Belum ada data experience.
            </div>
          </v-card>
        </template>
      </v-col>
    </v-row>

    <ExperienceFormDialog
      v-model="createDialog"
      mode="create"
      @created="onExperienceCreated"
      @failed="onFormFailed"
    />

    <ExperienceFormDialog
      v-model="editDialog"
      :experience="selectedExperience"
      mode="edit"
      @failed="onFormFailed"
      @updated="onExperienceUpdated"
    />

    <ConfirmDialog
      v-model="deleteDialog"
      cancel-text="Batal"
      confirm-color="error"
      confirm-text="Ya, hapus"
      :message="deleteDialogMessage"
      :title="deleteDialogTitle"
      @confirm="confirmDelete"
    />

    <ConfirmDialog
      v-model="statusDialog"
      cancel-text="Batal"
      confirm-color="primary"
      confirm-text="Ya, lanjutkan"
      :message="statusDialogMessage"
      :title="statusDialogTitle"
      @confirm="confirmStatusChange"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import type { Experience } from '@/model/experience'
  import draggable from 'vuedraggable'
  import { useDisplay } from 'vuetify'
  import { deleteExperienceApi, fetchExperienceDetailApi, fetchExperiencesApi, updateExperienceApi, updateExperiencesSortApi } from '@/api/experience-service'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import ExperienceFormDialog from '@/components/experience/ExperienceFormDialog.vue'
  import { useAppStore } from '@/stores/app'

  const { smAndDown } = useDisplay()
  const appStore = useAppStore()

  const experiences = ref<Experience[]>([])
  const loading = ref(false)
  const loadError = ref<string | null>(null)
  const search = ref<string | null>('')
  const formErrors = ref<string[]>([])
  const sortLoading = ref(false)
  const sortError = ref<string | null>(null)
  const sortDirty = ref(false)

  const createDialog = ref(false)
  const editDialog = ref(false)
  const deleteDialog = ref(false)
  const statusDialog = ref(false)

  const selectedExperience = ref<Experience | null>(null)
  const loadingExperienceId = ref<number | null>(null)
  const lastOrderBackup = ref<Experience[] | null>(null)

  const isSearchActive = computed(() => (search.value ?? '').trim().length > 0)
  const isSortDisabled = computed(() => sortLoading.value || isSearchActive.value)

  const deleteDialogTitle = computed(() => {
    if (!selectedExperience.value) {
      return 'Hapus experience'
    }

    return 'Konfirmasi hapus experience'
  })

  const deleteDialogMessage = computed(() => {
    if (!selectedExperience.value) {
      return 'Apakah Anda yakin ingin menghapus experience ini?'
    }

    return `Apakah Anda yakin ingin menghapus experience "${selectedExperience.value.company_name}"?`
  })

  const statusDialogTitle = computed(() => {
    if (!selectedExperience.value) {
      return 'Ubah status publish'
    }

    return selectedExperience.value.is_published ? 'Jadikan Draft' : 'Publish'
  })

  const statusDialogMessage = computed(() => {
    if (!selectedExperience.value) {
      return 'Apakah Anda yakin ingin mengubah status publish experience ini?'
    }

    if (selectedExperience.value.is_published) {
      return `Apakah Anda yakin ingin menjadikan "${selectedExperience.value.company_name}" sebagai draft?`
    }

    return `Apakah Anda yakin ingin publish "${selectedExperience.value.company_name}"?`
  })

  onMounted(() => {
    loadExperiences()
  })

  function clearSearch (): void {
    search.value = ''
    refreshPage()
  }

  function refreshPage (): void {
    loadExperiences()
  }

  function loadExperiences (): void {
    loading.value = true
    loadError.value = null
    sortError.value = null

    const normalizedSearch = (search.value ?? '').trim()

    fetchExperiencesApi({
      search: normalizedSearch.length > 0 ? normalizedSearch : null,
    }).then(response => {
      experiences.value = response.data?.data ?? []
      sortDirty.value = false
      lastOrderBackup.value = null
    }).catch(error => {
      console.error('Failed to load experiences', error)
      loadError.value = 'Gagal memuat data experience.'
    }).finally(() => {
      loading.value = false
    })
  }

  function openCreateDialog (): void {
    selectedExperience.value = null
    formErrors.value = []
    createDialog.value = true
  }

  function openEditDialog (experience: Experience): void {
    const id = experience.id

    loadingExperienceId.value = id
    formErrors.value = []

    fetchExperienceDetailApi(id).then(response => {
      selectedExperience.value = response.data.data
      editDialog.value = true
    }).catch(error => {
      console.error('Failed to load experience detail', error)
      loadError.value = 'Gagal memuat detail experience.'
    }).finally(() => {
      loadingExperienceId.value = null
    })
  }

  function openDeleteDialog (experience: Experience): void {
    selectedExperience.value = experience
    deleteDialog.value = true
  }

  function openStatusDialog (experience: Experience): void {
    selectedExperience.value = experience
    statusDialog.value = true
  }

  function onExperienceCreated (_experience: Experience): void {
    formErrors.value = []
    loadExperiences()
    appStore.showSuccess('Experience berhasil dibuat.')
  }

  function onExperienceUpdated (_experience: Experience): void {
    formErrors.value = []
    loadExperiences()
    appStore.showSuccess('Experience berhasil diperbarui.')
  }

  function onFormFailed (errors: string[]): void {
    formErrors.value = errors
  }

  function confirmDelete (): void {
    if (!selectedExperience.value) {
      return
    }

    const id = selectedExperience.value.id

    loadingExperienceId.value = id

    deleteExperienceApi(id).then(() => {
      deleteDialog.value = false
      selectedExperience.value = null
      loadExperiences()
      appStore.showSuccess('Experience berhasil dihapus.')
    }).catch(error => {
      console.error('Failed to delete experience', error)
    }).finally(() => {
      loadingExperienceId.value = null
    })
  }

  function confirmStatusChange (): void {
    if (!selectedExperience.value) {
      return
    }

    const id = selectedExperience.value.id
    const next = !selectedExperience.value.is_published

    loadingExperienceId.value = id

    updateExperienceApi(id, {
      is_published: next,
    }).then(() => {
      loadExperiences()
      appStore.showSuccess('Status publish berhasil diperbarui.')
    }).catch(error => {
      console.error('Failed to update experience status', error)
    }).finally(() => {
      loadingExperienceId.value = null
    })
  }

  function onDragStart (): void {
    if (isSortDisabled.value) {
      return
    }
    sortError.value = null
    if (!lastOrderBackup.value) {
      lastOrderBackup.value = experiences.value.slice()
    }
  }

  function onDragEnd (): void {
    if (isSortDisabled.value) {
      return
    }
    if (experiences.value.length === 0) {
      return
    }

    sortError.value = null
    sortDirty.value = true
  }

  function saveSort (): void {
    if (isSortDisabled.value) {
      return
    }
    if (experiences.value.length === 0) {
      return
    }

    sortLoading.value = true
    sortError.value = null

    const ids = experiences.value.map(item => item.id)

    updateExperiencesSortApi({ ids }).then(() => {
      loadExperiences()
      appStore.showSuccess('Urutan experience berhasil disimpan.')
    }).catch(error => {
      console.error('Failed to update experiences sort', error)
      sortError.value = 'Gagal menyimpan urutan. Urutan dikembalikan seperti semula.'
      sortDirty.value = false

      if (lastOrderBackup.value) {
        experiences.value = lastOrderBackup.value.slice()
      }
    }).finally(() => {
      sortLoading.value = false
      lastOrderBackup.value = null
    })
  }

  function formatYears (experience: Experience): string {
    const start = experience.year_start === null ? '—' : String(experience.year_start)
    if (experience.is_current) {
      return `${start} - Sekarang`
    }

    const end = experience.year_end === null ? '—' : String(experience.year_end)
    return `${start} - ${end}`
  }
</script>
