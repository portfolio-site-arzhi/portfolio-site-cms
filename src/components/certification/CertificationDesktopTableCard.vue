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
            Sertifikasi
          </th>
          <th>
            Penerbit
          </th>
          <th style="width: 160px">
            Bulan Terbit
          </th>
          <th style="width: 120px">
            Status
          </th>
          <th style="width: 64px" />
        </tr>
      </thead>

      <draggable
        v-model="internalCertifications"
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
                {{ element.name_en }}
              </div>
            </td>
            <td>
              {{ element.issuing_organization }}
            </td>
            <td>
              {{ props.formatIssueDate(element) }}
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
              <CertificationActionsMenu
                :certification="element"
                :disabled="props.loadingCertificationId === element.id || props.isSortDisabled"
                :loading="props.loadingCertificationId === element.id"
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
