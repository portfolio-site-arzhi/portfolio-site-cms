<template>
  <v-dialog
    v-model="internalModel"
    fullscreen
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ props.mode === 'create' ? 'Tambah Education' : 'Edit Education' }}
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
              name="education_is_active"
              v-bind="isActiveProps"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="institution_name"
              density="compact"
              :error-messages="errors.institution_name ? [errors.institution_name] : []"
              label="Nama Institusi"
              name="education_institution_name"
              variant="outlined"
              v-bind="institutionNameProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="degree"
              density="compact"
              :error-messages="errors.degree ? [errors.degree] : []"
              label="Gelar (ID)"
              name="education_degree"
              variant="outlined"
              v-bind="degreeProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="degree_en"
              density="compact"
              :error-messages="errors.degree_en ? [errors.degree_en] : []"
              label="Gelar (EN)"
              name="education_degree_en"
              variant="outlined"
              v-bind="degreeEnProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="field_of_study"
              density="compact"
              :error-messages="errors.field_of_study ? [errors.field_of_study] : []"
              label="Jurusan (ID)"
              name="education_field_of_study"
              variant="outlined"
              v-bind="fieldOfStudyProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="field_of_study_en"
              density="compact"
              :error-messages="errors.field_of_study_en ? [errors.field_of_study_en] : []"
              label="Jurusan (EN)"
              name="education_field_of_study_en"
              variant="outlined"
              v-bind="fieldOfStudyEnProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="start_date"
              density="compact"
              :error-messages="errors.start_date ? [errors.start_date] : []"
              label="Bulan Mulai"
              name="education_start_date"
              type="month"
              variant="outlined"
              v-bind="startDateProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="end_date"
              density="compact"
              :error-messages="errors.end_date ? [errors.end_date] : []"
              label="Bulan Selesai (opsional)"
              name="education_end_date"
              type="month"
              variant="outlined"
              v-bind="endDateProps"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="location"
              density="compact"
              :error-messages="errors.location ? [errors.location] : []"
              label="Lokasi (opsional)"
              name="education_location"
              variant="outlined"
              v-bind="locationProps"
            />
          </v-col>

          <v-col cols="12">
            <ExperienceDescriptionLocaleEditor
              v-model="activeLocale"
              v-model:description-en="description_en"
              v-model:description-id="description"
              :description-en-error="errors.description_en ?? null"
              :description-id-error="errors.description ?? null"
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
  import type { Education } from '@/model/education'
  import ExperienceDescriptionLocaleEditor from '@/components/experience/ExperienceDescriptionLocaleEditor.vue'
  import { useEducationFormDialog } from '@/logic/educations/use-education-form-dialog'

  const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    education?: Education | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', education: Education): void
    (e: 'failed', errors: string[]): void
  }>()

  const {
    internalModel,
    activeLocale,
    errors,
    isSubmitting,
    setValues,
    institution_name,
    institutionNameProps,
    degree,
    degreeProps,
    degree_en,
    degreeEnProps,
    field_of_study,
    fieldOfStudyProps,
    field_of_study_en,
    fieldOfStudyEnProps,
    start_date,
    startDateProps,
    end_date,
    endDateProps,
    description,
    description_en,
    location,
    locationProps,
    is_active,
    isActiveProps,
    onCancel,
    onSubmit,
  } = useEducationFormDialog({
    props,
    emit,
  })

  defineExpose({
    onSubmit,
    setValues,
  })
</script>
