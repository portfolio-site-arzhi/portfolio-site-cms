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
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-subtitle-2">
                Skills / Tech Stack
              </div>
              <div class="d-flex align-center ga-2">
                <v-btn
                  color="primary"
                  data-test="add-skill"
                  :disabled="isSubmitting"
                  size="small"
                  variant="outlined"
                  @click="openSkillDialog"
                >
                  <v-icon icon="mdi-plus" start />
                  Tambah Skill
                </v-btn>
              </div>
            </div>

            <v-card elevation="0" variant="outlined">
              <div v-if="smAndDown" class="pa-3">
                <div
                  v-if="skillsDraft.length === 0"
                  class="text-body-2 text-medium-emphasis py-4 text-center"
                >
                  Belum ada skill.
                </div>

                <draggable
                  v-else
                  v-model="skillsDraft"
                  :disabled="isSkillsSortDisabled"
                  handle=".skills-drag-handle"
                  :item-key="skillKey"
                  @end="onSkillsDragEnd"
                >
                  <template #item="{ element, index }">
                    <div class="d-flex align-center justify-space-between py-2 border-b">
                      <div class="d-flex align-center ga-2">
                        <v-btn
                          class="skills-drag-handle"
                          :disabled="isSkillsSortDisabled"
                          icon
                          size="small"
                          variant="text"
                        >
                          <v-icon icon="mdi-drag" />
                        </v-btn>
                        <div class="font-weight-medium">
                          {{ element.skill_name }}
                        </div>
                      </div>

                      <v-btn
                        :data-test="`remove-skill-${index}`"
                        :disabled="isSubmitting"
                        icon
                        size="small"
                        variant="text"
                        @click="removeSkillAt(index)"
                      >
                        <v-icon icon="mdi-delete-outline" />
                      </v-btn>
                    </div>
                  </template>
                </draggable>
              </div>

              <v-table v-else density="compact">
                <thead>
                  <tr>
                    <th style="width: 44px" />
                    <th style="width: 64px">
                      No
                    </th>
                    <th>
                      Skill
                    </th>
                    <th style="width: 72px" />
                  </tr>
                </thead>
                <tbody v-if="skillsDraft.length === 0">
                  <tr>
                    <td class="text-center text-medium-emphasis py-4" colspan="4">
                      Belum ada skill.
                    </td>
                  </tr>
                </tbody>

                <draggable
                  v-else
                  v-model="skillsDraft"
                  :disabled="isSkillsSortDisabled"
                  handle=".skills-drag-handle"
                  :item-key="skillKey"
                  tag="tbody"
                  @end="onSkillsDragEnd"
                >
                  <template #item="{ element, index }">
                    <tr>
                      <td>
                        <v-btn
                          class="skills-drag-handle"
                          :disabled="isSkillsSortDisabled"
                          icon
                          size="small"
                          variant="text"
                        >
                          <v-icon icon="mdi-drag" />
                        </v-btn>
                      </td>
                      <td>
                        {{ index + 1 }}
                      </td>
                      <td class="font-weight-medium">
                        {{ element.skill_name }}
                      </td>
                      <td class="text-right">
                        <v-btn
                          :data-test="`remove-skill-${index}`"
                          :disabled="isSubmitting"
                          icon
                          size="small"
                          variant="text"
                          @click="removeSkillAt(index)"
                        >
                          <v-icon icon="mdi-delete-outline" />
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </draggable>
              </v-table>
            </v-card>

            <div
              v-if="errors.skills"
              class="text-error text-caption mt-1"
              data-test="skills-error"
            >
              {{ String(errors.skills) }}
            </div>
          </v-col>

          <v-col cols="12">
            <v-tabs v-model="activeLocale" density="compact">
              <v-tab value="id">
                ID
              </v-tab>
              <v-tab value="en">
                EN
              </v-tab>
            </v-tabs>

            <v-window v-model="activeLocale" class="mt-4">
              <v-window-item value="id">
                <RichTextEditor
                  v-model="description_id"
                  :error-messages="errors.description_id ? [errors.description_id] : []"
                  label="Deskripsi (ID)"
                />
              </v-window-item>
              <v-window-item value="en">
                <RichTextEditor
                  v-model="description_en"
                  :error-messages="errors.description_en ? [errors.description_en] : []"
                  label="Deskripsi (EN)"
                />
              </v-window-item>
            </v-window>
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

    <v-dialog
      v-model="skillDialog"
      max-width="560"
    >
      <template v-if="skillDialog">
        <v-card>
          <v-toolbar color="surface" density="compact">
            <v-btn
              :disabled="isSubmitting"
              icon
              variant="text"
              @click="closeSkillDialog"
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
              :disabled="isSubmitting"
              variant="flat"
              @click="saveSkill"
            >
              Simpan
            </v-btn>
          </v-toolbar>

          <v-card-text class="pt-4">
            <v-text-field
              v-model="skillName"
              data-test="skill-name-input"
              density="compact"
              :disabled="isSubmitting"
              :error-messages="skillError ? [skillError] : []"
              label="Nama Skill"
              name="experience_skill_name"
              placeholder="Contoh: TypeScript"
              variant="outlined"
              @keydown.enter.prevent="saveSkill"
            />
            <div class="text-caption text-medium-emphasis">
              Maksimal 100 karakter. Skill harus unik.
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { Experience, ExperienceFormValues, ExperienceSkillDraft } from '@/model/experience'
  import { useForm } from 'vee-validate'
  import draggable from 'vuedraggable'
  import { useDisplay } from 'vuetify'
  import { createExperienceApi, updateExperienceApi } from '@/api/experience-service'
  import RichTextEditor from '@/components/RichTextEditor.vue'
  import { createDefaultExperienceFormValues, experienceSchema } from '@/schemas/experience'

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

  const internalModel = computed({
    get () {
      return props.modelValue
    },
    set (value: boolean) {
      emit('update:modelValue', value)
    },
  })

  const { smAndDown } = useDisplay()

  const activeLocale = ref<'id' | 'en'>('id')
  const skillDialog = ref(false)
  const skillName = ref('')
  const skillError = ref<string | null>(null)
  const skillsDraft = ref<ExperienceSkillDraft[]>([])
  const isSyncingSkills = ref(false)

  const {
    defineField,
    errors,
    handleSubmit,
    isSubmitting,
    resetForm,
    setValues,
    validateField,
  } = useForm({
    validationSchema: experienceSchema,
    initialValues: createDefaultExperienceFormValues(),
  })

  const [is_published, isPublishedProps] = defineField('is_published')
  const [role_id, roleIdProps] = defineField('role_id')
  const [role_en, roleEnProps] = defineField('role_en')
  const [company_name, companyNameProps] = defineField('company_name')
  const [company_url, companyUrlProps] = defineField('company_url')
  const [year_start, yearStartProps] = defineField('year_start')
  const [year_end, yearEndProps] = defineField('year_end')
  const [is_current, isCurrentProps] = defineField('is_current')
  const [description_id] = defineField('description_id')
  const [description_en] = defineField('description_en')
  const [skills] = defineField('skills')

  const isSkillsSortDisabled = computed(() => isSubmitting.value)

  watch(skills, next => {
    if (isSyncingSkills.value) {
      return
    }
    if (!Array.isArray(next)) {
      return
    }

    const cleaned = next
      .map(skill_name => String(skill_name ?? '').trim())
      .filter(skill_name => skill_name.length > 0)

    const unique: string[] = []
    for (const item of cleaned) {
      const key = item.toLowerCase()
      if (!unique.some(existing => existing.toLowerCase() === key)) {
        unique.push(item)
      }
    }

    skillsDraft.value = unique.map(skill_name => ({
      id: null,
      skill_name,
    }))
  }, { deep: true, flush: 'sync' })

  watch(is_current, value => {
    if (value) {
      year_end.value = ''
      validateField('year_end')
    }
  })

  watch(
    () => props.modelValue,
    value => {
      if (value) {
        initializeForm()
      }
    },
  )

  watch(
    () => props.experience,
    () => {
      if (props.modelValue && props.mode === 'edit') {
        initializeForm()
      }
    },
  )

  function toNullableString (value: string): string | null {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    return trimmed
  }

  function toNullableYear (value: string): number | null {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      return null
    }
    const numeric = Number(trimmed)
    if (!Number.isFinite(numeric)) {
      return null
    }
    return Math.trunc(numeric)
  }

  function normalizeSkills (value: string[]): Array<{ skill_name: string }> {
    const cleaned = value
      .map(v => (typeof v === 'string' ? v.trim() : ''))
      .filter(v => v.length > 0)

    const unique: string[] = []
    for (const item of cleaned) {
      if (!unique.includes(item)) {
        unique.push(item)
      }
    }

    return unique.map(skill_name => ({ skill_name }))
  }

  function syncSkillsFieldFromDraft (): void {
    isSyncingSkills.value = true
    skills.value = skillsDraft.value.map(item => item.skill_name)
    isSyncingSkills.value = false
    validateField('skills')
  }

  function sortBySortField<T extends { sort: number }> (items: T[]): T[] {
    const result: T[] = []

    for (const item of items) {
      const insertIndex = result.findIndex(existing => item.sort < existing.sort)
      if (insertIndex === -1) {
        result.push(item)
      } else {
        result.splice(insertIndex, 0, item)
      }
    }

    return result
  }

  function initializeForm (): void {
    activeLocale.value = 'id'
    closeSkillDialog()

    if (props.mode === 'create') {
      skillsDraft.value = []
      resetForm({
        values: createDefaultExperienceFormValues(),
      })
      return
    }

    if (!props.experience) {
      skillsDraft.value = []
      resetForm({
        values: createDefaultExperienceFormValues(),
      })
      return
    }

    const sortedSkills = Array.isArray(props.experience.skills)
      ? sortBySortField(props.experience.skills)
      : []
    skillsDraft.value = sortedSkills.map(s => ({ id: s.id, skill_name: s.skill_name }))

    setValues({
      is_published: props.experience.is_published,
      role_id: props.experience.role_id,
      role_en: props.experience.role_en,
      company_name: props.experience.company_name,
      company_url: props.experience.company_url ?? '',
      year_start: props.experience.year_start === null ? '' : String(props.experience.year_start),
      year_end: props.experience.year_end === null ? '' : String(props.experience.year_end),
      is_current: props.experience.is_current,
      description_id: props.experience.description_id,
      description_en: props.experience.description_en,
      skills: skillsDraft.value.map(s => s.skill_name),
    } satisfies ExperienceFormValues)
  }

  function onCancel (): void {
    internalModel.value = false
  }

  function openSkillDialog (): void {
    skillError.value = null
    skillName.value = ''
    skillDialog.value = true
  }

  function closeSkillDialog (): void {
    skillDialog.value = false
    skillError.value = null
    skillName.value = ''
  }

  function saveSkill (): void {
    const raw = String(skillName.value ?? '')
    const normalized = raw.trim()

    if (normalized.length === 0) {
      skillError.value = 'Nama skill wajib diisi'
      return
    }

    if (normalized.length > 100) {
      skillError.value = 'Nama skill maksimal 100 karakter'
      return
    }

    const existing = skills.value.map(s => s.trim().toLowerCase())
    if (existing.includes(normalized.toLowerCase())) {
      skillError.value = 'Skill sudah ada'
      return
    }

    skillsDraft.value = [...skillsDraft.value, { id: null, skill_name: normalized }]
    skillError.value = null
    syncSkillsFieldFromDraft()
    closeSkillDialog()
  }

  function removeSkillAt (index: number): void {
    if (index < 0 || index >= skillsDraft.value.length) {
      return
    }
    const next = skillsDraft.value.slice()
    next.splice(index, 1)
    skillsDraft.value = next
    syncSkillsFieldFromDraft()
  }

  function skillKey (skill: ExperienceSkillDraft): string {
    if (skill.id !== null) {
      return `id-${skill.id}`
    }
    return `new-${skill.skill_name}`
  }

  function onSkillsDragEnd (): void {
    if (isSkillsSortDisabled.value) {
      return
    }

    syncSkillsFieldFromDraft()
  }

  const onSubmit = handleSubmit(values => {
    const payload = {
      is_published: values.is_published,
      role_id: values.role_id.trim(),
      role_en: values.role_en.trim(),
      company_name: values.company_name.trim(),
      company_url: toNullableString(values.company_url),
      year_start: toNullableYear(values.year_start),
      year_end: values.is_current ? null : toNullableYear(values.year_end),
      is_current: values.is_current,
      description_id: values.description_id,
      description_en: values.description_en,
      skills: normalizeSkills(values.skills),
    }

    if (props.mode === 'create') {
      return createExperienceApi(payload).then(response => {
        emit('created', response.data.data)
        internalModel.value = false
      }).catch(error => {
        console.error('Failed to save experience', error)
        emit('failed', extractFormErrors(error))
      })
    }

    if (!props.experience) {
      return Promise.resolve()
    }

    return updateExperienceApi(props.experience.id, payload).then(response => {
      emit('updated', response.data.data)
      internalModel.value = false
    }).catch(error => {
      console.error('Failed to save experience', error)
      emit('failed', extractFormErrors(error))
    })
  })

  function extractFormErrors (error: unknown): string[] {
    if (typeof error !== 'object' || error === null) {
      return ['Terjadi kesalahan saat menyimpan data experience.']
    }

    if (!('isAxiosError' in error)) {
      return ['Terjadi kesalahan saat menyimpan data experience.']
    }

    const axiosError = error as { formErrors?: string[], response?: { data?: { errors?: string[] } } }

    if (Array.isArray(axiosError.formErrors) && axiosError.formErrors.length > 0) {
      return axiosError.formErrors
    }

    const data = axiosError.response?.data
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
    }

    return ['Terjadi kesalahan saat menyimpan data experience.']
  }
</script>
