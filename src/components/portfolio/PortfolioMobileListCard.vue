<template>
  <v-card
    elevation="0"
    variant="outlined"
  >
    <draggable
      v-model="internalPortfolios"
      :disabled="props.isSortDisabled"
      handle=".drag-handle"
      item-key="id"
      @end="emit('drag-end')"
      @start="emit('drag-start')"
    >
      <template #item="{ element }">
        <div class="px-4 py-3 d-flex align-start border-b">
          <v-btn
            class="drag-handle mr-3 mt-2"
            :disabled="props.isSortDisabled"
            icon
            size="small"
            variant="text"
          >
            <v-icon icon="mdi-drag" />
          </v-btn>

          <div class="flex-grow-1">
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

              <div class="min-w-0">
                <div class="font-weight-medium">
                  {{ element.title }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ element.slug }}
                </div>
              </div>
            </div>

            <div class="text-body-2 text-medium-emphasis mt-3">
              {{ props.formatDescription(element.description) }}
            </div>

            <div class="text-caption text-medium-emphasis mt-2">
              {{ element.role || '-' }} • {{ props.formatPublishedAt(element.published_at) }}
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

          <PortfolioActionsMenu
            :disabled="props.loadingPortfolioId === element.id || props.isSortDisabled"
            :loading="props.loadingPortfolioId === element.id"
            :portfolio="element"
            @delete="emit('delete', element)"
            @edit="emit('edit', element)"
            @toggle-status="emit('toggle-status', element)"
          />
        </div>
      </template>
    </draggable>

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

  .min-w-0 {
    min-width: 0;
  }
</style>
