<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom start"
  >
    <template #activator="{ props: menuProps }">
      <v-text-field
        v-bind="menuProps"
        :density="density"
        :error-messages="errorMessages"
        :label="label"
        :model-value="modelValue"
        readonly
        style="cursor: pointer"
        :variant="variant"
      >
        <template #prepend-inner>
          <div
            class="color-preview border mr-2"
            :style="{ backgroundColor: modelValue || '#FFFFFF' }"
          />
        </template>
      </v-text-field>
    </template>
    <v-card min-width="300">
      <v-color-picker
        elevation="0"
        mode="hex"
        :model-value="modelValue"
        @update:model-value="updateColor"
      />
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    modelValue?: string
    label?: string
    density?: 'default' | 'comfortable' | 'compact'
    variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'
    errorMessages?: string | string[]
  }>(), {
    modelValue: '#000000',
    label: 'Color',
    density: 'compact',
    variant: 'outlined',
    errorMessages: undefined,
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const menu = ref(false)

  function updateColor (color: string) {
    emit('update:modelValue', color)
  }
</script>

<style scoped>
.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
