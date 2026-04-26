<template>
  <v-dialog
    v-model="internalModel"
    max-width="560"
  >
    <template v-if="internalModel">
      <v-card>
        <v-toolbar color="surface" density="compact">
          <v-btn
            :disabled="props.isSubmitting"
            icon
            variant="text"
            @click="internalModel = false"
          >
            <v-icon icon="mdi-close" />
          </v-btn>
          <v-toolbar-title class="text-subtitle-1">
            {{ props.dialogTitle }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            color="primary"
            :disabled="props.isSubmitting"
            variant="flat"
            @click="emit('save')"
          >
            Simpan
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-4">
          <v-text-field
            density="compact"
            :disabled="props.isSubmitting"
            :error-messages="props.stackError ? [props.stackError] : []"
            label="Nama Stack"
            :model-value="props.stackName"
            name="portfolio_stack_name"
            placeholder="Contoh: Vue 3"
            variant="outlined"
            @keydown.enter.prevent="emit('save')"
            @update:model-value="onStackNameUpdate"
          />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    modelValue: boolean
    dialogTitle: string
    stackName: string
    stackError: string | null
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:stackName', value: string): void
    (e: 'save'): void
  }>()

  const internalModel = computed({
    get () {
      return props.modelValue
    },
    set (value: boolean) {
      emit('update:modelValue', value)
    },
  })

  function onStackNameUpdate (value: unknown): void {
    emit('update:stackName', String(value ?? ''))
  }
</script>
