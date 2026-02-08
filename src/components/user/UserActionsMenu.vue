<template>
  <v-menu location="bottom end">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :disabled="isMenuDisabled"
        icon
        :loading="isRowLoading"
        variant="text"
      >
        <v-icon icon="mdi-dots-vertical" />
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        :disabled="!props.user"
        @click="onEditClick"
      >
        <v-list-item-title>
          Edit
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        :disabled="!props.user"
        @click="onToggleStatusClick"
      >
        <v-list-item-title>
          {{ statusActionLabel }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        :disabled="!props.user"
        @click="onDeleteClick"
      >
        <v-list-item-title class="text-error">
          Hapus
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
  import type { User } from '@/model/user'

  const props = defineProps<{
    user: User | null
    loadingUserId: number | null
  }>()

  const emit = defineEmits<{
    (e: 'edit' | 'toggle-status' | 'delete', user: User): void
  }>()

  const isRowLoading = computed(() => {
    if (!props.user) {
      return false
    }

    return props.loadingUserId === props.user.id
  })

  const isMenuDisabled = computed(() => isRowLoading.value || !props.user)

  const statusActionLabel = computed(() => {
    if (!props.user) {
      return 'Ubah status'
    }

    return props.user.status ? 'Nonaktifkan' : 'Aktifkan'
  })

  function onEditClick (): void {
    if (!props.user) {
      return
    }

    emit('edit', props.user)
  }

  function onToggleStatusClick (): void {
    if (!props.user) {
      return
    }

    emit('toggle-status', props.user)
  }

  function onDeleteClick (): void {
    if (!props.user) {
      return
    }

    emit('delete', props.user)
  }
</script>
