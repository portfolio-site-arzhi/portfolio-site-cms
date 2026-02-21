<template>
  <v-card
    elevation="0"
    variant="outlined"
  >
    <draggable
      v-model="internalEducations"
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
              {{ element.institution_name }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ element.degree }} · {{ element.field_of_study }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ props.formatPeriod(element) }}
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

          <EducationActionsMenu
            :disabled="props.loadingEducationId === element.id || props.isSortDisabled"
            :education="element"
            :loading="props.loadingEducationId === element.id"
            @delete="emit('delete', element)"
            @edit="emit('edit', element)"
            @toggle-status="emit('toggle-status', element)"
          />
        </div>
      </template>
    </draggable>

    <div
      v-if="internalEducations.length === 0"
      class="text-center text-medium-emphasis py-6"
    >
      Belum ada data education.
    </div>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Education } from '@/model/education'
  import draggable from 'vuedraggable'
  import EducationActionsMenu from '@/components/education/EducationActionsMenu.vue'

  const props = defineProps<{
    modelValue: Education[]
    formatPeriod: (education: Education) => string
    isSortDisabled: boolean
    loadingEducationId: number | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Education[]): void
    (e: 'drag-start' | 'drag-end'): void
    (e: 'edit' | 'delete' | 'toggle-status', value: Education): void
  }>()

  const internalEducations = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })
</script>
