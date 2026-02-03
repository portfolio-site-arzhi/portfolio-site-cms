<template>
  <div>
    <!-- Photo Upload Section -->
    <div class="d-flex flex-column align-center mb-6">
      <v-hover v-slot="slotProps">
        <div
          v-bind="slotProps ? slotProps.props : {}"
          class="position-relative cursor-pointer rounded-circle overflow-hidden elevation-2"
          style="width: 150px; height: 150px;"
          @click="triggerFileInput"
        >
          <v-img
            class="bg-grey-lighten-2"
            cover
            height="150"
            :src="displayPhoto"
            width="150"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height text-grey">
                <v-icon size="48">
                  mdi-account
                </v-icon>
              </div>
            </template>
            <template #error>
              <div class="d-flex align-center justify-center fill-height text-grey">
                <v-icon size="48">
                  mdi-account
                </v-icon>
              </div>
            </template>
          </v-img>

          <!-- Hover Overlay -->
          <div
            v-if="slotProps && slotProps.isHovering"
            class="d-flex align-center justify-center position-absolute w-100 h-100"
            style="top: 0; left: 0; background-color: rgba(0,0,0,0.5);"
          >
            <v-icon
              color="white"
              size="32"
            >
              mdi-pencil
            </v-icon>
          </div>
        </div>
      </v-hover>

      <!-- Delete Button -->
      <v-btn
        v-if="displayPhoto"
        class="mt-2"
        color="error"
        density="compact"
        prepend-icon="mdi-delete"
        size="small"
        variant="text"
        @click="handleDeletePhoto"
      >
        Hapus Foto
      </v-btn>

      <div class="text-caption text-medium-emphasis mt-2 text-center">
        Allowed extensions: .jpg, .jpeg, .png, .webp<br>
        Recommended size: 300x300px
      </div>

      <input
        ref="fileInput"
        accept="image/jpeg,image/png,image/webp"
        class="d-none"
        type="file"
        @change="handleFileChange"
      >
    </div>

    <v-card
      class="mb-4"
      variant="flat"
    >
      <v-card-text>
        <div class="text-subtitle-2 font-weight-medium mb-3">
          Informasi Profil (Global)
        </div>
        <v-text-field
          class="mb-3"
          density="compact"
          :error-messages="errors?.['home.name']"
          label="Nama Lengkap"
          :model-value="modelValue.name"
          name="home_name"
          variant="outlined"
          @update:model-value="val => updateSingle('name', val)"
        />
        <v-text-field
          density="compact"
          :error-messages="errors?.['home.position']"
          label="Posisi / Jabatan"
          :model-value="modelValue.position"
          name="home_position"
          variant="outlined"
          @update:model-value="val => updateSingle('position', val)"
        />
      </v-card-text>
    </v-card>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          class="bg-grey-lighten-4"
          variant="flat"
        >
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar
                class="mr-2"
                color="red"
                size="24"
              >
                <span class="text-caption text-white font-weight-bold">ID</span>
              </v-avatar>
              <span class="font-weight-bold">Bahasa Indonesia</span>
            </div>

            <v-textarea
              auto-grow
              class="mb-3"
              density="compact"
              :error-messages="errors?.['home.description.id']"
              label="Deskripsi Singkat (ID)"
              :model-value="modelValue.description.id"
              name="home_description_id"
              rows="3"
              variant="outlined"
              @update:model-value="val => updateDescription('id', val)"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <v-card
          class="bg-blue-grey-lighten-5"
          variant="flat"
        >
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar
                class="mr-2"
                color="blue"
                size="24"
              >
                <span class="text-caption text-white font-weight-bold">EN</span>
              </v-avatar>
              <span class="font-weight-bold">English</span>
            </div>

            <v-textarea
              auto-grow
              class="mb-3"
              density="compact"
              :error-messages="errors?.['home.description.en']"
              label="Short Description (EN)"
              :model-value="modelValue.description.en"
              name="home_description_en"
              rows="3"
              variant="outlined"
              @update:model-value="val => updateDescription('en', val)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
  import type { SiteConfigHomeValue } from '@/model/site-config'

  const modelValue = defineModel<SiteConfigHomeValue & {
    status_file?: number
  }>({ required: true })

  const file = defineModel<File | null>('file', { required: true })
  const fileInput = ref<HTMLInputElement | null>(null)
  const previewUrl = ref<string>('')

  const props = defineProps<{
    errors?: Record<string, string>
    validateField?: (path: string) => unknown
  }>()

  const displayPhoto = computed(() => {
    if (previewUrl.value) return previewUrl.value
    if (modelValue.value.photo) return modelValue.value.photo
    return ''
  })

  watch(() => file.value, newFile => {
    if (newFile) {
      if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = URL.createObjectURL(newFile)
    } else {
      if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl.value)
      }
      previewUrl.value = ''
    }
  })

  onUnmounted(() => {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
  })

  function triggerFileInput () {
    fileInput.value?.click()
  }

  function handleFileChange (event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      const selectedFile = target.files[0]
      if (selectedFile) {
        file.value = selectedFile

        // Update status_file to 1 (Change)
        modelValue.value = {
          ...modelValue.value,
          status_file: 1,
        }
      }
    }
    // Clear input value to allow re-uploading the same file
    target.value = ''
  }

  function handleDeletePhoto () {
    file.value = null
    previewUrl.value = ''

    // Update status_file to 1 (Change/Delete) and clear photo URL
    modelValue.value = {
      ...modelValue.value,
      status_file: 1,
      photo: null,
    }
  }

  function updateSingle (field: 'name' | 'position', value: string) {
    modelValue.value = {
      ...modelValue.value,
      [field]: value,
    }
    if (props.validateField) {
      props.validateField(`home.${field}`)
    }
  }

  function updateDescription (locale: 'id' | 'en', value: string) {
    modelValue.value = {
      ...modelValue.value,
      description: {
        ...modelValue.value.description,
        [locale]: value,
      },
    }
    if (props.validateField) {
      props.validateField(`home.description.${locale}`)
    }
  }
</script>
