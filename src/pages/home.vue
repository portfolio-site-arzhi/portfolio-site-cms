<template>
  <v-container
    class="py-6"
    fluid
  >
    <v-row class="mb-4" no-gutters>
      <v-col
        class="d-flex flex-column flex-sm-row align-sm-center justify-sm-space-between mb-4"
        cols="12"
      >
        <div>
          <div class="text-h5 font-weight-medium mb-1">
            Selamat datang di CMS Portfolio
          </div>
          <div class="text-body-2 text-medium-emphasis">
            Kelola konten portfolio, project, dan artikel Anda dari satu tempat.
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="g-4">
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          elevation="2"
          rounded="lg"
        >
          <v-card-title class="d-flex align-center">
            <v-avatar
              class="mr-3"
              color="primary"
            >
              <span class="text-h6 text-white">
                {{ profileInitial }}
              </span>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ profileName }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ profileEmail }}
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis mb-2">
              Status akun:
              <span class="font-weight-medium">
                {{ profileStatusText }}
              </span>
            </div>
            <div class="text-caption text-medium-emphasis">
              Data profil diambil dari Google Account yang terhubung.
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="8"
      >
        <v-card
          elevation="2"
          rounded="lg"
        >
          <v-card-title>
            Ringkasan aktivitas
          </v-card-title>
          <v-card-text>
            <div class="text-body-2 text-medium-emphasis">
              Halaman dashboard ini akan menampilkan ringkasan project, konten yang
              perlu di-review, dan statistik performa portfolio Anda.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useHomePage } from '@/logic/home/use-home-page'

  const {
    profileName,
    profileEmail,
    profileInitial,
    profileStatusText,
  } = useHomePage()
</script>
