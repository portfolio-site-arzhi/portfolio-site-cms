<template>
  <div>
    <v-card
      class="mb-4"
      variant="flat"
    >
      <v-card-text>
        <div class="text-subtitle-2 font-weight-medium mb-3">
          Informasi Kontak (Global)
        </div>
        <v-text-field
          density="compact"
          :error-messages="errors?.['about.email']"
          label="Email Kontak"
          :model-value="modelValue.email"
          name="about_email"
          prepend-inner-icon="mdi-email"
          type="email"
          variant="outlined"
          @update:model-value="val => updateEmail(val)"
        />
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="bg-grey-lighten-4" variant="flat">
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar class="mr-2" color="red" size="24">
                <span class="text-caption text-white font-weight-bold">ID</span>
              </v-avatar>
              <span class="font-weight-bold">Bahasa Indonesia</span>
            </div>

            <v-textarea
              auto-grow
              class="mb-3"
              density="compact"
              :error-messages="errors?.['about.about_me.id']"
              label="Tentang Saya (Lengkap)"
              :model-value="modelValue.about_me.id"
              name="about_about_me_id"
              rows="6"
              variant="outlined"
              @update:model-value="val => updateAboutMe('id', val)"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="bg-blue-grey-lighten-5" variant="flat">
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar class="mr-2" color="blue" size="24">
                <span class="text-caption text-white font-weight-bold">EN</span>
              </v-avatar>
              <span class="font-weight-bold">English</span>
            </div>

            <v-textarea
              auto-grow
              class="mb-3"
              density="compact"
              :error-messages="errors?.['about.about_me.en']"
              label="About Me (Full)"
              :model-value="modelValue.about_me.en"
              name="about_about_me_en"
              rows="6"
              variant="outlined"
              @update:model-value="val => updateAboutMe('en', val)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
  import type { SiteConfigAboutValue } from '@/model/site-config'

  const modelValue = defineModel<SiteConfigAboutValue>({ required: true })

  const props = defineProps<{
    errors?: Record<string, string>
    validateField?: (path: string) => unknown
  }>()

  function updateEmail (value: string) {
    modelValue.value = {
      ...modelValue.value,
      email: value,
    }
    if (props.validateField) {
      props.validateField('about.email')
    }
  }

  function updateAboutMe (locale: 'id' | 'en', value: string) {
    modelValue.value = {
      ...modelValue.value,
      about_me: {
        ...modelValue.value.about_me,
        [locale]: value,
      },
    }
    if (props.validateField) {
      props.validateField(`about.about_me.${locale}`)
    }
  }
</script>
