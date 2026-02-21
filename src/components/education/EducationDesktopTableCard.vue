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
            Institusi
          </th>
          <th>
            Gelar / Jurusan
          </th>
          <th style="width: 180px">
            Periode
          </th>
          <th style="width: 120px">
            Status
          </th>
          <th style="width: 64px" />
        </tr>
      </thead>

      <draggable
        v-model="internalEducations"
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
                {{ element.institution_name }}
              </div>
              <div
                v-if="element.location"
                class="text-caption text-medium-emphasis"
              >
                {{ element.location }}
              </div>
            </td>
            <td>
              <div class="font-weight-medium">
                {{ element.degree }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ element.field_of_study }}
              </div>
            </td>
            <td>
              {{ props.formatPeriod(element) }}
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
              <EducationActionsMenu
                :disabled="props.loadingEducationId === element.id || props.isSortDisabled"
                :education="element"
                :loading="props.loadingEducationId === element.id"
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
