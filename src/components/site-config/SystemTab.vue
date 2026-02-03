<template>
  <v-row>
    <v-col cols="12" md="6">
      <div class="text-subtitle-1 font-weight-bold mb-4">
        Warna Tema
      </div>
      <ColorPickerInput
        class="mb-4"
        :error-messages="errors?.['system.primary_color']"
        label="Primary Color"
        :model-value="modelValue.primary_color"
        @update:model-value="val => modelValue = { ...modelValue, primary_color: val }"
      />

      <ColorPickerInput
        :error-messages="errors?.['system.secondary_color']"
        label="Secondary Color"
        :model-value="modelValue.secondary_color"
        @update:model-value="val => modelValue = { ...modelValue, secondary_color: val }"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { SiteConfigSystemValue } from '@/model/site-config'
  import ColorPickerInput from '@/components/ColorPickerInput.vue'

  const modelValue = defineModel<SiteConfigSystemValue>({ required: true })

  const props = defineProps<{
    errors?: Record<string, string>
    validateField?: (path: string) => unknown
  }>()

  watch(
    () => modelValue.value.primary_color,
    () => {
      if (props.validateField) {
        props.validateField('system.primary_color')
      }
    },
  )

  watch(
    () => modelValue.value.secondary_color,
    () => {
      if (props.validateField) {
        props.validateField('system.secondary_color')
      }
    },
  )
</script>
