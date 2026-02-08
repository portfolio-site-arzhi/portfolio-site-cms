<template>
  <v-dialog
    v-model="internalModel"
    fullscreen
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ props.mode === 'create' ? 'Tambah Experience' : 'Edit Experience' }}
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-switch
              v-model="is_published"
              color="primary"
              hide-details
              inset
              label="Publish"
              name="experience_is_published"
              v-bind="isPublishedProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="company_name"
              density="compact"
              :error-messages="errors.company_name ? [errors.company_name] : []"
              label="Nama Perusahaan"
              name="experience_company_name"
              variant="outlined"
              v-bind="companyNameProps"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="company_url"
              density="compact"
              :error-messages="errors.company_url ? [errors.company_url] : []"
              label="URL Perusahaan (opsional)"
              name="experience_company_url"
              placeholder="https://example.com"
              variant="outlined"
              v-bind="companyUrlProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="role_id"
              density="compact"
              :error-messages="errors.role_id ? [errors.role_id] : []"
              label="Role (ID)"
              name="experience_role_id"
              variant="outlined"
              v-bind="roleIdProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="role_en"
              density="compact"
              :error-messages="errors.role_en ? [errors.role_en] : []"
              label="Role (EN)"
              name="experience_role_en"
              variant="outlined"
              v-bind="roleEnProps"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="year_start"
              density="compact"
              :error-messages="errors.year_start ? [errors.year_start] : []"
              label="Tahun Mulai (opsional)"
              name="experience_year_start"
              placeholder="2023"
              type="number"
              variant="outlined"
              v-bind="yearStartProps"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="year_end"
              :bg-color="is_current ? 'grey-lighten-3' : undefined"
              density="compact"
              :disabled="is_current"
              :error-messages="errors.year_end ? [errors.year_end] : []"
              label="Tahun Selesai (opsional)"
              name="experience_year_end"
              placeholder="2025"
              type="number"
              variant="outlined"
              v-bind="yearEndProps"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-switch
              v-model="is_current"
              class="mt-2"
              color="primary"
              hide-details
              inset
              label="Masih Berjalan"
              name="experience_is_current"
              v-bind="isCurrentProps"
            />
          </v-col>

          <v-col cols="12">
            <ExperienceSkillsEditor
              v-model="skills"
              :disabled="isSubmitting"
              :error-message="errors.skills ? String(errors.skills) : null"
              @changed="validateField('skills')"
            />
          </v-col>

          <v-col cols="12">
            <ExperienceDescriptionLocaleEditor
              v-model="activeLocale"
              v-model:description-en="description_en"
              v-model:description-id="description_id"
              :description-en-error="errors.description_en ?? null"
              :description-id-error="errors.description_id ?? null"
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
  import type { Experience } from '@/model/experience'
  import ExperienceDescriptionLocaleEditor from '@/components/experience/ExperienceDescriptionLocaleEditor.vue'
  import ExperienceSkillsEditor from '@/components/experience/ExperienceSkillsEditor.vue'
  import { useExperienceFormDialog } from '@/logic/experiences/use-experience-form-dialog'

  const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    experience?: Experience | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', experience: Experience): void
    (e: 'failed', errors: string[]): void
  }>()

  const {
    internalModel,
    activeLocale,
    errors,
    isSubmitting,
    validateField,
    setValues,
    is_published,
    isPublishedProps,
    role_id,
    roleIdProps,
    role_en,
    roleEnProps,
    company_name,
    companyNameProps,
    company_url,
    companyUrlProps,
    year_start,
    yearStartProps,
    year_end,
    yearEndProps,
    is_current,
    isCurrentProps,
    description_id,
    description_en,
    skills,
    onCancel,
    onSubmit,
  } = useExperienceFormDialog({
    props,
    emit,
  })

  defineExpose({
    onSubmit,
    setValues,
  })
</script>
