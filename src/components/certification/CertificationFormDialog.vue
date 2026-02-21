<template>
  <v-dialog
    v-model="internalModel"
    fullscreen
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ props.mode === 'create' ? 'Tambah Certification' : 'Edit Certification' }}
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
              name="certification_is_active"
              v-bind="isActiveProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="name"
              density="compact"
              :error-messages="errors.name ? [errors.name] : []"
              label="Nama Sertifikasi (ID)"
              name="certification_name"
              variant="outlined"
              v-bind="nameProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="name_en"
              density="compact"
              :error-messages="errors.name_en ? [errors.name_en] : []"
              label="Nama Sertifikasi (EN)"
              name="certification_name_en"
              variant="outlined"
              v-bind="nameEnProps"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="issuing_organization"
              density="compact"
              :error-messages="errors.issuing_organization ? [errors.issuing_organization] : []"
              label="Penerbit"
              name="certification_issuing_organization"
              variant="outlined"
              v-bind="issuingOrganizationProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="issue_date"
              density="compact"
              :error-messages="errors.issue_date ? [errors.issue_date] : []"
              label="Bulan Terbit"
              name="certification_issue_date"
              type="month"
              variant="outlined"
              v-bind="issueDateProps"
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
  import type { Certification } from '@/model/certification'
  import ExperienceDescriptionLocaleEditor from '@/components/experience/ExperienceDescriptionLocaleEditor.vue'
  import { useCertificationFormDialog } from '@/logic/certifications/use-certification-form-dialog'

  const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    certification?: Certification | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', certification: Certification): void
    (e: 'failed', errors: string[]): void
  }>()

  const {
    internalModel,
    activeLocale,
    errors,
    isSubmitting,
    setValues,
    name,
    nameProps,
    name_en,
    nameEnProps,
    issuing_organization,
    issuingOrganizationProps,
    issue_date,
    issueDateProps,
    description,
    description_en,
    is_active,
    isActiveProps,
    onCancel,
    onSubmit,
  } = useCertificationFormDialog({
    props,
    emit,
  })

  defineExpose({
    onSubmit,
    setValues,
  })
</script>
