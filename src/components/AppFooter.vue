<template>
  <v-footer
    app
    class="px-4"
    height="48"
  >
    <div class="d-flex align-center justify-space-between w-100">
      <div class="text-caption text-medium-emphasis">
        © {{ currentYear }} Ardi Portfolio CMS
      </div>

      <div class="d-flex align-center">
        <v-btn
          aria-label="GitHub"
          color="primary"
          href="https://github.com/"
          icon
          rel="noopener noreferrer"
          target="_blank"
          variant="text"
        >
          <v-icon icon="mdi-github" />
        </v-btn>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
  const currentYear = new Date().getFullYear()
</script>
