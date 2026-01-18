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
  import { storeToRefs } from 'pinia'
  import { getNameInitials } from '@/helper/name-initial'
  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()

  const { profile, isLoggedIn } = storeToRefs(authStore)

  const profileName = computed(() => {
    if (!profile.value) {
      return 'Pengguna'
    }

    return profile.value.name
  })

  const profileEmail = computed(() => {
    if (!profile.value) {
      return 'Email belum tersedia'
    }

    return profile.value.email
  })

  const profileInitial = computed(() => {
    if (!profile.value || !profile.value.name) {
      return 'P'
    }

    const initials = getNameInitials(profile.value.name)

    if (!initials) {
      return 'P'
    }

    return initials
  })

  const profileStatusText = computed(() => {
    if (!profile.value) {
      if (isLoggedIn.value) {
        return 'Memuat profil...'
      }

      return 'Belum login'
    }

    if (profile.value.status) {
      return 'Aktif'
    }

    return 'Nonaktif'
  })
</script>
