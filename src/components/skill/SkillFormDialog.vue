<template>
  <v-dialog
    v-model="internalModel"
    fullscreen
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ props.mode === 'create' ? 'Tambah Grup Skill' : 'Edit Grup Skill' }}
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-switch
              v-model="is_active"
              color="primary"
              hide-details
              inset
              label="Aktif"
              name="skill_group_is_active"
              v-bind="isActiveProps"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="name"
              density="compact"
              :error-messages="errors.name ? [errors.name] : []"
              label="Nama Grup Skill"
              name="skill_group_name"
              variant="outlined"
              v-bind="nameProps"
            />
          </v-col>

          <v-col cols="12">
            <SkillItemsEditor
              v-model="skills"
              :disabled="isSubmitting"
              :error-message="errors.skills ? String(errors.skills) : null"
              @changed="validateField('skills')"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="secondary"
          variant="text"
          @click="onCancel"
        >
          Batal
        </v-btn>

        <v-btn
          color="primary"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          variant="flat"
          @click="onSubmit"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { SkillGroup } from '@/model/skill'
  import SkillItemsEditor from '@/components/skill/SkillItemsEditor.vue'
  import { useSkillFormDialog } from '@/logic/skills/use-skill-form-dialog'

  const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    skill?: SkillGroup | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', skill: SkillGroup): void
    (e: 'failed', errors: string[]): void
  }>()

  const {
    internalModel,
    errors,
    isSubmitting,
    validateField,
    setValues,
    name,
    nameProps,
    is_active,
    isActiveProps,
    skills,
    onCancel,
    onSubmit,
  } = useSkillFormDialog({
    props,
    emit,
  })

  defineExpose({
    onSubmit,
    setValues,
  })
</script>
