<template>
  <v-dialog
    v-model="internalModel"
    max-width="400"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ title }}
      </v-card-title>

      <v-card-text class="text-body-2 text-medium-emphasis">
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="secondary"
          variant="text"
          @click="onCancel"
        >
          {{ cancelText }}
        </v-btn>

        <v-btn
          :color="confirmColor"
          variant="flat"
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmColor?: string
  }>(), {
    confirmText: 'Ya',
    cancelText: 'Batal',
    confirmColor: 'error',
  })

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm' | 'cancel'): void
  }>()

  const internalModel = computed({
    get () {
      return props.modelValue
    },
    set (value: boolean) {
      emit('update:modelValue', value)
    },
  })

  function onCancel (): void {
    emit('cancel')
    emit('update:modelValue', false)
  }

  function onConfirm (): void {
    emit('confirm')
    emit('update:modelValue', false)
  }
</script>
