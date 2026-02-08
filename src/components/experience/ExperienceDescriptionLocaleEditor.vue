<template>
  <v-tabs v-model="internalLocale" density="compact">
    <v-tab value="id">
      ID
    </v-tab>
    <v-tab value="en">
      EN
    </v-tab>
  </v-tabs>

  <v-window v-model="internalLocale" class="mt-4">
    <v-window-item value="id">
      <RichTextEditor
        v-model="internalDescriptionId"
        :error-messages="props.descriptionIdError ? [props.descriptionIdError] : []"
        label="Deskripsi (ID)"
      />
    </v-window-item>
    <v-window-item value="en">
      <RichTextEditor
        v-model="internalDescriptionEn"
        :error-messages="props.descriptionEnError ? [props.descriptionEnError] : []"
        label="Deskripsi (EN)"
      />
    </v-window-item>
  </v-window>
</template>

<script lang="ts" setup>
  import RichTextEditor from '@/components/RichTextEditor.vue'

  const props = defineProps<{
    modelValue: 'id' | 'en'
    descriptionId: string
    descriptionEn: string
    descriptionIdError: string | null
    descriptionEnError: string | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: 'id' | 'en'): void
    (e: 'update:descriptionId' | 'update:descriptionEn', value: string): void
  }>()

  const internalLocale = computed({
    get () {
      return props.modelValue
    },
    set (value: 'id' | 'en') {
      emit('update:modelValue', value)
    },
  })

  const internalDescriptionId = computed({
    get () {
      return props.descriptionId
    },
    set (value: string) {
      emit('update:descriptionId', value)
    },
  })

  const internalDescriptionEn = computed({
    get () {
      return props.descriptionEn
    },
    set (value: string) {
      emit('update:descriptionEn', value)
    },
  })
</script>
