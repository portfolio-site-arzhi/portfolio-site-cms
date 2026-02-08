<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="text-subtitle-2">
        Skills / Tech Stack
      </div>
      <div class="d-flex align-center ga-2">
        <v-btn
          color="primary"
          data-test="add-skill"
          :disabled="props.disabled"
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
                :disabled="props.disabled"
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
                  :disabled="props.disabled"
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
      v-if="props.errorMessage"
      class="text-error text-caption mt-1"
      data-test="skills-error"
    >
      {{ props.errorMessage }}
    </div>

    <ExperienceSkillDialog
      :is-submitting="props.disabled"
      :model-value="skillDialog"
      :skill-error="skillError"
      :skill-name="skillName"
      @save="saveSkill"
      @update:model-value="onSkillDialogUpdate"
      @update:skill-name="onSkillNameUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
  import draggable from 'vuedraggable'
  import { useDisplay } from 'vuetify'
  import ExperienceSkillDialog from '@/components/experience/ExperienceSkillDialog.vue'
  import { useExperienceSkillsEditor } from '@/logic/experiences/use-experience-skills-editor'

  const props = defineProps<{
    modelValue: string[]
    disabled: boolean
    errorMessage: string | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void
    (e: 'changed'): void
  }>()

  const { smAndDown } = useDisplay()

  const {
    skillDialog,
    skillName,
    skillError,
    skillsDraft,
    isSkillsSortDisabled,
    openSkillDialog,
    onSkillDialogUpdate,
    onSkillNameUpdate,
    saveSkill,
    removeSkillAt,
    skillKey,
    onSkillsDragEnd,
  } = useExperienceSkillsEditor({
    props,
    emit,
  })
</script>
