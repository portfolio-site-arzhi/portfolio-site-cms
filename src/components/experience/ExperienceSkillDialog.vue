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
            Tambah Skill
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            color="primary"
            data-test="save-skill"
            :disabled="props.isSubmitting"
            variant="flat"
            @click="emit('save')"
          >
            Simpan
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-4">
          <v-text-field
            data-test="skill-name-input"
            density="compact"
            :disabled="props.isSubmitting"
            :error-messages="props.skillError ? [props.skillError] : []"
            label="Nama Skill"
            :model-value="props.skillName"
            name="experience_skill_name"
            placeholder="Contoh: TypeScript"
            variant="outlined"
            @keydown.enter.prevent="emit('save')"
            @update:model-value="onSkillNameUpdate"
          />
          <div class="text-caption text-medium-emphasis">
            Maksimal 100 karakter. Skill harus unik.
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    modelValue: boolean
    skillName: string
    skillError: string | null
    isSubmitting: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:skillName', value: string): void
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

  function onSkillNameUpdate (value: unknown): void {
    emit('update:skillName', String(value ?? ''))
  }
</script>
