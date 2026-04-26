<template>
  <div>
    <div class="d-flex flex-column flex-md-row ga-4 align-start">
      <div class="portfolio-image-frame">
        <v-img
          v-if="displayImage"
          cover
          height="180"
          :src="displayImage"
          width="280"
        />
        <div
          v-else
          class="portfolio-image-placeholder d-flex flex-column align-center justify-center text-medium-emphasis"
        >
          <v-icon
            class="mb-2"
            icon="mdi-image-outline"
            size="40"
          />
          <div class="text-body-2">
            Belum ada gambar
          </div>
        </div>
      </div>

      <div class="flex-grow-1">
        <div class="text-subtitle-2 mb-2">
          Gambar Project
        </div>
        <div class="text-body-2 text-medium-emphasis mb-4">
          Format yang didukung: JPG, PNG, atau WebP. Rekomendasi ukuran 1022x540 pixel.
        </div>

        <div class="d-flex flex-wrap ga-2">
          <v-btn
            color="primary"
            :disabled="props.disabled"
            prepend-icon="mdi-upload"
            variant="flat"
            @click="triggerFileInput"
          >
            {{ displayImage ? 'Ganti Gambar' : 'Upload Gambar' }}
          </v-btn>

          <v-btn
            v-if="displayImage"
            color="error"
            :disabled="props.disabled"
            prepend-icon="mdi-delete-outline"
            variant="text"
            @click="removeImage"
          >
            Hapus Gambar
          </v-btn>
        </div>

        <input
          ref="fileInput"
          accept="image/jpeg,image/png,image/webp"
          class="d-none"
          name="portfolio_image"
          type="file"
          @change="handleFileChange"
        >

        <div
          v-if="props.errorMessage"
          class="text-error text-caption mt-2"
        >
          {{ props.errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    modelValue: string | null
    file: File | null
    disabled: boolean
    errorMessage: string | null
  }>()

  const emit = defineEmits<{
    (e: 'changed', value: File | null): void
    (e: 'remove'): void
  }>()

  const fileInput = ref<HTMLInputElement | null>(null)
  const previewUrl = ref('')

  const displayImage = computed(() => {
    if (previewUrl.value) {
      return previewUrl.value
    }

    return props.modelValue ?? ''
  })

  watch(() => props.file, nextFile => {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }

    if (nextFile) {
      previewUrl.value = URL.createObjectURL(nextFile)
    }
  })

  onUnmounted(() => {
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
  })

  function triggerFileInput (): void {
    fileInput.value?.click()
  }

  function handleFileChange (event: Event): void {
    const target = event.target as HTMLInputElement
    const selectedFile = target.files?.item(0) ?? null

    emit('changed', selectedFile)
    target.value = ''
  }

  function removeImage (): void {
    emit('remove')
  }
</script>

<style scoped>
  .portfolio-image-frame {
    width: 280px;
    height: 180px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    background: rgb(var(--v-theme-surface-variant));
    max-width: 100%;
  }

  .portfolio-image-placeholder {
    width: 100%;
    height: 100%;
  }
</style>
