<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card class="bg-grey-lighten-4" variant="flat">
        <v-card-text>
          <div class="d-flex align-center mb-4">
            <v-avatar class="mr-2" color="primary" size="24">
              <span class="text-caption text-white font-weight-bold">ALL</span>
            </v-avatar>
            <span class="font-weight-bold">Footer Links</span>
          </div>

          <v-text-field
            class="mb-3"
            density="compact"
            :error-messages="errors?.['footer.github']"
            label="GitHub URL"
            :model-value="modelValue.github"
            name="footer_github"
            prepend-inner-icon="mdi-github"
            variant="outlined"
            @update:model-value="val => update('github', val)"
          />
          <v-text-field
            class="mb-3"
            density="compact"
            :error-messages="errors?.['footer.linkedin']"
            label="LinkedIn URL"
            :model-value="modelValue.linkedin"
            name="footer_linkedin"
            prepend-inner-icon="mdi-linkedin"
            variant="outlined"
            @update:model-value="val => update('linkedin', val)"
          />
          <v-text-field
            density="compact"
            :error-messages="errors?.['footer.instagram']"
            label="Instagram URL"
            :model-value="modelValue.instagram"
            name="footer_instagram"
            prepend-inner-icon="mdi-instagram"
            variant="outlined"
            @update:model-value="val => update('instagram', val)"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { SiteConfigFooterValue } from '@/model/site-config'

  const modelValue = defineModel<SiteConfigFooterValue>({ required: true })

  const props = defineProps<{
    errors?: Record<string, string>
    validateField?: (path: string) => unknown
  }>()

  function update (field: keyof SiteConfigFooterValue, value: string) {
    modelValue.value = {
      ...modelValue.value,
      [field]: value,
    }
    if (props.validateField) {
      props.validateField(`footer.${field}`)
    }
  }
</script>
