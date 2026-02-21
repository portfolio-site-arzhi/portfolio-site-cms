<template>
  <v-menu location="bottom end">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :disabled="props.disabled"
        icon
        :loading="props.loading"
        variant="text"
      >
        <v-icon icon="mdi-dots-vertical" />
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item @click="emit('edit', props.education)">
        <v-list-item-title>
          Edit
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="emit('toggle-status', props.education)">
        <v-list-item-title>
          {{ statusLabel }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="emit('delete', props.education)">
        <v-list-item-title class="text-error">
          Hapus
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
  import type { Education } from '@/model/education'

  const props = defineProps<{
    education: Education
    disabled: boolean
    loading: boolean
  }>()

  const emit = defineEmits<{
    (e: 'edit' | 'toggle-status' | 'delete', education: Education): void
  }>()

  const statusLabel = computed(() => (
    props.education.is_active ? 'Nonaktifkan' : 'Aktifkan'
  ))
</script>
