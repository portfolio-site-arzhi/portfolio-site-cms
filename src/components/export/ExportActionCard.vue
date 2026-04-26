<template>
  <v-card
    class="h-100"
    variant="outlined"
  >
    <v-card-text class="d-flex flex-column fill-height">
      <div class="d-flex align-start justify-space-between ga-4 mb-4">
        <div>
          <div class="text-overline text-medium-emphasis mb-1">
            PDF Export
          </div>
          <div class="text-h6 font-weight-medium mb-2">
            {{ title }}
          </div>
          <div class="text-body-2 text-medium-emphasis">
            {{ description }}
          </div>
        </div>

        <v-avatar
          color="primary"
          size="44"
          variant="tonal"
        >
          <v-icon :icon="icon" />
        </v-avatar>
      </div>

      <div class="d-flex align-center mb-4">
        <v-icon
          aria-label="PDF"
          color="error"
          icon="mdi-file-pdf-box"
          size="32"
          title="PDF"
        />
      </div>

      <div class="text-body-2 text-medium-emphasis mb-6">
        {{ helperText }}
      </div>

      <v-spacer />

      <v-btn
        :block="smAndDown"
        color="primary"
        :data-test="dataTest"
        :disabled="disabled"
        :loading="loading"
        variant="flat"
        @click="emit('export')"
      >
        <v-icon
          :icon="buttonIcon"
          start
        />
        {{ buttonText }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { useDisplay } from 'vuetify'

  defineProps<{
    title: string
    description: string
    helperText: string
    icon: string
    buttonText: string
    buttonIcon: string
    loading: boolean
    disabled: boolean
    dataTest: string
  }>()

  const emit = defineEmits<{
    export: []
  }>()

  const { smAndDown } = useDisplay()
</script>
