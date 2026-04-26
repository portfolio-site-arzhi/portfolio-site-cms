<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="text-subtitle-2">
        Tech Stack
      </div>

      <v-btn
        color="primary"
        :disabled="props.disabled"
        prepend-icon="mdi-plus"
        size="small"
        variant="outlined"
        @click="openCreateStackDialog"
      >
        Tambah Stack
      </v-btn>
    </div>

    <v-card elevation="0" variant="outlined">
      <div v-if="smAndDown" class="pa-3">
        <div
          v-if="stacksDraft.length === 0"
          class="text-body-2 text-medium-emphasis py-4 text-center"
        >
          Belum ada stack.
        </div>

        <draggable
          v-else
          v-model="stacksDraft"
          :disabled="isStacksSortDisabled"
          handle=".stack-drag-handle"
          :item-key="stackKey"
          @end="onStacksDragEnd"
        >
          <template #item="{ element, index }">
            <div class="d-flex align-center justify-space-between py-2 border-b">
              <div class="d-flex align-center ga-2">
                <v-btn
                  class="stack-drag-handle"
                  :disabled="isStacksSortDisabled"
                  icon
                  size="small"
                  variant="text"
                >
                  <v-icon icon="mdi-drag" />
                </v-btn>

                <div class="font-weight-medium">
                  {{ element.name }}
                </div>
              </div>

              <div class="d-flex align-center ga-1">
                <v-btn
                  :disabled="props.disabled"
                  icon
                  size="small"
                  variant="text"
                  @click="openEditStackDialog(index)"
                >
                  <v-icon icon="mdi-pencil-outline" />
                </v-btn>
                <v-btn
                  :disabled="props.disabled"
                  icon
                  size="small"
                  variant="text"
                  @click="removeStackAt(index)"
                >
                  <v-icon icon="mdi-delete-outline" />
                </v-btn>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <v-table v-else density="compact">
        <thead>
          <tr>
            <th style="width: 44px" />
            <th style="width: 64px">
              No
            </th>
            <th>
              Stack
            </th>
            <th style="width: 96px" />
          </tr>
        </thead>

        <tbody v-if="stacksDraft.length === 0">
          <tr>
            <td class="text-center text-medium-emphasis py-4" colspan="4">
              Belum ada stack.
            </td>
          </tr>
        </tbody>

        <draggable
          v-else
          v-model="stacksDraft"
          :disabled="isStacksSortDisabled"
          handle=".stack-drag-handle"
          :item-key="stackKey"
          tag="tbody"
          @end="onStacksDragEnd"
        >
          <template #item="{ element, index }">
            <tr>
              <td>
                <v-btn
                  class="stack-drag-handle"
                  :disabled="isStacksSortDisabled"
                  icon
                  size="small"
                  variant="text"
                >
                  <v-icon icon="mdi-drag" />
                </v-btn>
              </td>
              <td>
                {{ index + 1 }}
              </td>
              <td class="font-weight-medium">
                {{ element.name }}
              </td>
              <td class="text-right">
                <v-btn
                  :disabled="props.disabled"
                  icon
                  size="small"
                  variant="text"
                  @click="openEditStackDialog(index)"
                >
                  <v-icon icon="mdi-pencil-outline" />
                </v-btn>
                <v-btn
                  :disabled="props.disabled"
                  icon
                  size="small"
                  variant="text"
                  @click="removeStackAt(index)"
                >
                  <v-icon icon="mdi-delete-outline" />
                </v-btn>
              </td>
            </tr>
          </template>
        </draggable>
      </v-table>
    </v-card>

    <div
      v-if="props.errorMessage"
      class="text-error text-caption mt-1"
    >
      {{ props.errorMessage }}
    </div>

    <PortfolioStackDialog
      :dialog-title="stackDialogTitle"
      :is-submitting="props.disabled"
      :model-value="stackDialog"
      :stack-error="stackError"
      :stack-name="stackName"
      @save="saveStack"
      @update:model-value="onStackDialogUpdate"
      @update:stack-name="onStackNameUpdate"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { PortfolioStackDraft } from '@/model/portfolio'
  import draggable from 'vuedraggable'
  import { useDisplay } from 'vuetify'
  import PortfolioStackDialog from '@/components/portfolio/PortfolioStackDialog.vue'
  import { usePortfolioStacksEditor } from '@/logic/portfolios/use-portfolio-stacks-editor'

  const props = defineProps<{
    modelValue: PortfolioStackDraft[]
    disabled: boolean
    errorMessage: string | null
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: PortfolioStackDraft[]): void
    (e: 'changed'): void
  }>()

  const { smAndDown } = useDisplay()

  const {
    stackDialog,
    stackName,
    stackError,
    stacksDraft,
    isStacksSortDisabled,
    openCreateStackDialog,
    openEditStackDialog,
    onStackDialogUpdate,
    onStackNameUpdate,
    saveStack,
    removeStackAt,
    stackKey,
    onStacksDragEnd,
  } = usePortfolioStacksEditor({
    props,
    emit,
  })

  const stackDialogTitle = computed(() => (
    stackDialog.value && stackName.value.length > 0 ? 'Edit Stack' : 'Tambah Stack'
  ))
</script>
