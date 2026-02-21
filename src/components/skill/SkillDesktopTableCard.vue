<template>
  <v-card
    elevation="0"
    variant="outlined"
  >
    <v-table density="compact">
      <thead>
        <tr>
          <th style="width: 44px" />
          <th style="width: 220px">
            Grup Skill
          </th>
          <th>
            Daftar Skill
          </th>
          <th style="width: 110px">
            Status
          </th>
          <th style="width: 64px" />
        </tr>
      </thead>

      <draggable
        v-model="internalSkillGroups"
        :disabled="props.isSortDisabled"
        handle=".drag-handle"
        item-key="id"
        tag="tbody"
        @end="emit('drag-end')"
        @start="emit('drag-start')"
      >
        <template #item="{ element }">
          <tr>
            <td>
              <v-btn
                class="drag-handle"
                :disabled="props.isSortDisabled"
                icon
                size="small"
                variant="text"
              >
                <v-icon icon="mdi-drag" />
              </v-btn>
            </td>
            <td>
              <div class="font-weight-medium">
                {{ element.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ element.skills.length }} skill
              </div>
            </td>
            <td>
              <div class="text-body-2">
                {{ props.formatSkillsPreview(element) }}
              </div>
            </td>
            <td>
              <v-chip
                :color="element.is_active ? 'success' : 'warning'"
                label
                size="small"
              >
                {{ element.is_active ? 'Aktif' : 'Nonaktif' }}
              </v-chip>
            </td>
            <td>
              <SkillActionsMenu
                :disabled="props.loadingSkillGroupId === element.id || props.isSortDisabled"
                :loading="props.loadingSkillGroupId === element.id"
                :skill-group="element"
                @delete="emit('delete', element)"
                @edit="emit('edit', element)"
                @toggle-status="emit('toggle-status', element)"
              />
            </td>
          </tr>
        </template>
      </draggable>
    </v-table>

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
