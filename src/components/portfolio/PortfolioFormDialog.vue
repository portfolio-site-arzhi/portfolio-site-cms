<template>
  <v-dialog
    v-model="internalModel"
    fullscreen
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ props.mode === 'create' ? 'Tambah Portfolio' : 'Edit Portfolio' }}
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
              name="portfolio_is_published"
              v-bind="isPublishedProps"
            />
          </v-col>

          <v-col cols="12">
            <PortfolioImageInput
              :disabled="isSubmitting"
              :error-message="errors.image_file ? String(errors.image_file) : null"
              :file="image_file"
              :model-value="image_url"
              @changed="onImageChange"
              @remove="onImageRemove"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="title"
              density="compact"
              :error-messages="errors.title ? [errors.title] : []"
              hint="Slug dibuat otomatis dari judul oleh backend."
              label="Judul Project"
              name="portfolio_title"
              persistent-hint
              variant="outlined"
              v-bind="titleProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="role"
              density="compact"
              :error-messages="errors.role ? [errors.role] : []"
              label="Role"
              name="portfolio_role"
              placeholder="Contoh: Frontend Lead"
              variant="outlined"
              v-bind="roleProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="published_at"
              density="compact"
              :error-messages="errors.published_at ? [errors.published_at] : []"
              label="Tanggal Publish"
              name="portfolio_published_at"
              type="datetime-local"
              variant="outlined"
              v-bind="publishedAtProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="live_url"
              density="compact"
              :error-messages="errors.live_url ? [errors.live_url] : []"
              label="Live URL"
              name="portfolio_live_url"
              placeholder="https://example.com"
              variant="outlined"
              v-bind="liveUrlProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="github_url"
              density="compact"
              :error-messages="errors.github_url ? [errors.github_url] : []"
              label="GitHub URL"
              name="portfolio_github_url"
              placeholder="https://github.com/example/project"
              variant="outlined"
              v-bind="githubUrlProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              v-model="description"
              auto-grow
              density="compact"
              :error-messages="errors.description ? [errors.description] : []"
              label="Deskripsi (ID)"
              name="portfolio_description"
              rows="4"
              variant="outlined"
              v-bind="descriptionProps"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              v-model="description_en"
              auto-grow
              density="compact"
              :error-messages="errors.description_en ? [errors.description_en] : []"
              label="Deskripsi (EN)"
              name="portfolio_description_en"
              rows="4"
              variant="outlined"
              v-bind="descriptionEnProps"
            />
          </v-col>

          <v-col cols="12">
            <PortfolioStacksEditor
              :disabled="isSubmitting"
              :error-message="errors.stacks ? String(errors.stacks) : null"
              :model-value="stacks"
              @changed="validateField('stacks')"
              @update:model-value="updateStacks"
            />
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-1 mb-2">
              Contribution
            </div>
            <ExperienceDescriptionLocaleEditor
              v-model="activeContributionLocale"
              v-model:description-en="contribution_en"
              v-model:description-id="contribution"
              :description-en-error="errors.contribution_en ?? null"
              :description-id-error="errors.contribution ?? null"
              label-en="Contribution (EN)"
              label-id="Contribution (ID)"
            />
          </v-col>

          <v-col cols="12">
            <div class="text-subtitle-1 mb-2">
              Outcome
            </div>
            <ExperienceDescriptionLocaleEditor
              v-model="activeOutcomeLocale"
              v-model:description-en="outcome_en"
              v-model:description-id="outcome"
              :description-en-error="errors.outcome_en ?? null"
              :description-id-error="errors.outcome ?? null"
              label-en="Outcome (EN)"
              label-id="Outcome (ID)"
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
          :data-test="props.mode === 'create' ? 'create-portfolio-submit' : 'edit-portfolio-submit'"
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
  import type { Portfolio } from '@/model/portfolio'
  import ExperienceDescriptionLocaleEditor from '@/components/experience/ExperienceDescriptionLocaleEditor.vue'
  import PortfolioImageInput from '@/components/portfolio/PortfolioImageInput.vue'
  import PortfolioStacksEditor from '@/components/portfolio/PortfolioStacksEditor.vue'
  import { usePortfolioFormDialog } from '@/logic/portfolios/use-portfolio-form-dialog'

  const props = defineProps<{
    modelValue: boolean
    mode: 'create' | 'edit'
    portfolio?: Portfolio | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'created' | 'updated', portfolio: Portfolio): void
    (e: 'failed', errors: string[]): void
  }>()

  const {
    internalModel,
    activeContributionLocale,
    activeOutcomeLocale,
    errors,
    isSubmitting,
    setValues,
    validateField,
    title,
    titleProps,
    description,
    descriptionProps,
    description_en,
    descriptionEnProps,
    contribution,
    contribution_en,
    outcome,
    outcome_en,
    role,
    roleProps,
    live_url,
    liveUrlProps,
    github_url,
    githubUrlProps,
    is_published,
    isPublishedProps,
    published_at,
    publishedAtProps,
    image_file,
    image_url,
    stacks,
    onCancel,
    onSubmit,
    onImageChange,
    onImageRemove,
    updateStacks,
  } = usePortfolioFormDialog({
    props,
    emit,
  })

  defineExpose({
    setValues,
    onSubmit,
    onImageChange,
    onImageRemove,
  })
</script>
