<template>
  <v-card
    elevation="0"
    variant="outlined"
  >
    <v-table density="compact">
      <thead>
        <tr>
          <th style="width: 44px" />
          <th>
            Perusahaan
          </th>
          <th>
            Role (ID / EN)
          </th>
          <th style="width: 160px">
            Periode
          </th>
          <th style="width: 120px">
            Status
          </th>
          <th style="width: 64px" />
        </tr>
      </thead>

      <draggable
        v-model="internalExperiences"
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
                {{ element.company_name }}
              </div>
              <div
                v-if="element.company_url"
                class="text-caption text-medium-emphasis"
              >
                {{ element.company_url }}
              </div>
            </td>
            <td>
              <div class="font-weight-medium">
                {{ element.role_id }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ element.role_en }}
              </div>
            </td>
            <td>
              {{ props.formatYears(element) }}
            </td>
            <td>
              <v-chip
                :color="element.is_published ? 'success' : 'warning'"
                label
                size="small"
              >
                {{ element.is_published ? 'Published' : 'Draft' }}
              </v-chip>
            </td>
            <td>
              <ExperienceActionsMenu
                :disabled="props.loadingExperienceId === element.id || props.isSortDisabled"
                :experience="element"
                :loading="props.loadingExperienceId === element.id"
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
