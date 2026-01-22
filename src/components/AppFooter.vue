<template>
  <v-footer
    app
    border="t"
    class="px-4"
    height="52"
  >
    <div class="d-flex align-center justify-center w-100">
      <div class="text-caption text-medium-emphasis">
        © {{ currentYear }} Ardi Portfolio CMS
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  const currentYear = new Date().getFullYear()
</script>
