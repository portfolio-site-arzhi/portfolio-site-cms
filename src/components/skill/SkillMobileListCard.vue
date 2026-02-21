<template>
  <v-card
    elevation="0"
    variant="outlined"
  >
    <draggable
      v-model="internalSkillGroups"
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
              {{ element.name }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ element.skills.length }} skill
            </div>
            <div class="text-caption text-medium-emphasis mt-1">
              {{ props.formatSkillsPreview(element) }}
            </div>
            <div class="mt-2">
              <v-chip
                :color="element.is_active ? 'success' : 'warning'"
                label
                size="x-small"
              >
                {{ element.is_active ? 'Aktif' : 'Nonaktif' }}
              </v-chip>
            </div>
          </div>

          <SkillActionsMenu
            :disabled="props.loadingSkillGroupId === element.id || props.isSortDisabled"
            :loading="props.loadingSkillGroupId === element.id"
            :skill-group="element"
            @delete="emit('delete', element)"
            @edit="emit('edit', element)"
            @toggle-status="emit('toggle-status', element)"
          />
        </div>
      </template>
    </draggable>

    <div
      v-if="internalSkillGroups.length === 0"
      class="text-center text-medium-emphasis py-6"
    >
      Belum ada data skill.
    </div>
  </v-card>
</template>

<script lang="ts" setup>
  import type { SkillGroup } from '@/model/skill'
  import draggable from 'vuedraggable'
  import SkillActionsMenu from '@/components/skill/SkillActionsMenu.vue'

  const props = defineProps<{
    modelValue: SkillGroup[]
    formatSkillsPreview: (skillGroup: SkillGroup) => string
    isSortDisabled: boolean
    loadingSkillGroupId: number | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: SkillGroup[]): void
    (e: 'drag-start' | 'drag-end'): void
    (e: 'edit' | 'delete' | 'toggle-status', value: SkillGroup): void
  }>()

  const internalSkillGroups = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })
</script>
