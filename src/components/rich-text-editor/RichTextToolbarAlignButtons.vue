<template>
  <v-tooltip location="bottom" text="Rata kiri">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isAlignActive('left')"
        :color="isAlignActive('left') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="setAlign('left')"
      >
        <v-icon icon="mdi-format-align-left" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Rata tengah">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isAlignActive('center')"
        :color="isAlignActive('center') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="setAlign('center')"
      >
        <v-icon icon="mdi-format-align-center" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Rata kanan">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isAlignActive('right')"
        :color="isAlignActive('right') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="setAlign('right')"
      >
        <v-icon icon="mdi-format-align-right" />
      </v-btn>
    </template>
  </v-tooltip>
  <v-tooltip location="bottom" text="Rata kiri-kanan (justify)">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :active="isAlignActive('justify')"
        :color="isAlignActive('justify') ? 'primary' : undefined"
        :disabled="props.disabled"
        icon
        size="small"
        variant="text"
        @click="setAlign('justify')"
      >
        <v-icon icon="mdi-format-align-justify" />
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
  import type { Editor } from '@tiptap/core'

  const props = defineProps<{
    editor: Editor | null
    disabled: boolean
  }>()

  function isAlignActive (align: 'left' | 'center' | 'right' | 'justify'): boolean {
    return props.editor?.isActive({ textAlign: align }) === true
  }

  function setAlign (align: 'left' | 'center' | 'right' | 'justify'): void {
    props.editor?.chain().focus().setTextAlign(align).run()
  }
</script>
