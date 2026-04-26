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
            Project
          </th>
          <th style="width: 180px">
            Role
          </th>
          <th style="width: 180px">
            Publish
          </th>
          <th style="width: 120px">
            Status
          </th>
          <th style="width: 64px" />
        </tr>
      </thead>

      <draggable
        v-model="internalPortfolios"
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
              <div class="d-flex align-center ga-3">
                <div class="portfolio-thumb">
                  <v-img
                    v-if="element.image"
                    cover
                    height="56"
                    :src="element.image"
                    width="88"
                  />
                  <div
                    v-else
                    class="portfolio-thumb__placeholder d-flex align-center justify-center"
                  >
                    <v-icon icon="mdi-image-outline" />
                  </div>
                </div>

                <div>
                  <div class="font-weight-medium">
                    {{ element.title }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ element.slug }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    {{ props.formatDescription(element.description) }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="font-weight-medium">
                {{ element.role || '-' }}
              </div>
            </td>
            <td>
              {{ props.formatPublishedAt(element.published_at) }}
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
              <PortfolioActionsMenu
                :disabled="props.loadingPortfolioId === element.id || props.isSortDisabled"
                :loading="props.loadingPortfolioId === element.id"
                :portfolio="element"
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
      v-if="internalPortfolios.length === 0"
      class="text-center text-medium-emphasis py-6"
    >
      Belum ada data portfolio.
    </div>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Portfolio } from '@/model/portfolio'
  import draggable from 'vuedraggable'
  import PortfolioActionsMenu from '@/components/portfolio/PortfolioActionsMenu.vue'

  const props = defineProps<{
    modelValue: Portfolio[]
    formatDescription: (value: string) => string
    formatPublishedAt: (value: string | null) => string
    isSortDisabled: boolean
    loadingPortfolioId: number | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: Portfolio[]): void
    (e: 'drag-start' | 'drag-end'): void
    (e: 'edit' | 'delete' | 'toggle-status', value: Portfolio): void
  }>()

  const internalPortfolios = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
  })
</script>

<style scoped>
  .portfolio-thumb {
    width: 88px;
    height: 56px;
    border-radius: 8px;
    overflow: hidden;
    background: rgb(var(--v-theme-surface-variant));
    flex-shrink: 0;
  }

  .portfolio-thumb__placeholder {
    width: 100%;
    height: 100%;
    color: rgba(var(--v-theme-on-surface), 0.45);
  }
</style>
