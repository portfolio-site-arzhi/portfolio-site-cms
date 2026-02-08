<template>
  <v-card
    elevation="0"
    variant="outlined"
  >
    <draggable
      v-model="internalExperiences"
      :disabled="props.isSortDisabled"
      handle=".drag-handle"
      item-key="id"
      @end="emit('drag-end')"
      @start="emit('drag-start')"
    >
      <template #item="{ element }">
        <div class="px-4 py-3 d-flex align-center border-b">
          <v-btn
            class="drag-handle mr-3"
            :disabled="props.isSortDisabled"
            icon
            size="small"
            variant="text"
          >
            <v-icon icon="mdi-drag" />
          </v-btn>

          <div class="flex-grow-1">
            <div class="font-weight-medium">
              {{ element.company_name }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ element.role_id }} · {{ element.role_en }} · {{ props.formatYears(element) }}
            </div>
            <div class="mt-2">
              <v-chip
                :color="element.is_published ? 'success' : 'warning'"
                label
                size="x-small"
              >
                {{ element.is_published ? 'Published' : 'Draft' }}
              </v-chip>
            </div>
          </div>

          <ExperienceActionsMenu
            :disabled="props.loadingExperienceId === element.id || props.isSortDisabled"
            :experience="element"
            :loading="props.loadingExperienceId === element.id"
            @delete="emit('delete', element)"
            @edit="emit('edit', element)"
            @toggle-status="emit('toggle-status', element)"
          />
        </div>
      </template>
    </draggable>

    <div
      v-if="internalExperiences.length === 0"
      class="text-center text-medium-emphasis py-6"
    >
      Belum ada data experience.
    </div>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Experience } from '@/model/experience'
  import draggable from 'vuedraggable'
  import ExperienceActionsMenu from '@/components/experience/ExperienceActionsMenu.vue'

  const props = defineProps<{
    modelValue: Experience[]
    formatYears: (experience: Experience) => string
    isSortDisabled: boolean
    loadingExperienceId: number | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Experience[]): void
    (e: 'drag-start' | 'drag-end'): void
    (e: 'edit' | 'delete' | 'toggle-status', value: Experience): void
  }>()

  const internalExperiences = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })
</script>
