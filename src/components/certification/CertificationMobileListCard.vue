<template>
  <v-card
    elevation="0"
    variant="outlined"
  >
    <draggable
      v-model="internalCertifications"
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
              {{ element.issuing_organization }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ props.formatIssueDate(element) }}
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

          <CertificationActionsMenu
            :certification="element"
            :disabled="props.loadingCertificationId === element.id || props.isSortDisabled"
            :loading="props.loadingCertificationId === element.id"
            @delete="emit('delete', element)"
            @edit="emit('edit', element)"
            @toggle-status="emit('toggle-status', element)"
          />
        </div>
      </template>
    </draggable>

    <div
      v-if="internalCertifications.length === 0"
      class="text-center text-medium-emphasis py-6"
    >
      Belum ada data certification.
    </div>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Certification } from '@/model/certification'
  import draggable from 'vuedraggable'
  import CertificationActionsMenu from '@/components/certification/CertificationActionsMenu.vue'

  const props = defineProps<{
    modelValue: Certification[]
    formatIssueDate: (certification: Certification) => string
    isSortDisabled: boolean
    loadingCertificationId: number | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Certification[]): void
    (e: 'drag-start' | 'drag-end'): void
    (e: 'edit' | 'delete' | 'toggle-status', value: Certification): void
  }>()

  const internalCertifications = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })
</script>
