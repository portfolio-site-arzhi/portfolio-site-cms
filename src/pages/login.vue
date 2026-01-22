<template>
  <v-container class="fill-height d-flex align-center justify-center px-4">
    <v-row
      class="w-100"
      justify="center"
    >
      <v-col
        cols="12"
        lg="4"
        md="5"
        sm="8"
      >
        <v-card
          class="pa-6"
          elevation="8"
        >
          <div class="text-center mb-6">
            <v-avatar
              class="mb-4"
              color="primary"
              size="64"
            >
              <v-icon
                icon="mdi-account-circle"
                size="40"
              />
            </v-avatar>

            <div class="text-h5 font-weight-medium mb-1">
              Login ke CMS Portfolio
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Kelola konten portfolio Anda dengan aman menggunakan akun Google.
            </div>
          </div>

          <v-card-actions class="px-0">
            <v-btn
              block
              color="primary"
              size="large"
              variant="flat"
              @click="onLoginWithGoogle"
            >
              <v-icon
                icon="mdi-google"
                start
              />
              Login dengan Google
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  public: true
  layout: blank
</route>

<script setup lang="ts">
  import { navigateToUrl } from '@/utils/navigation'

  function onLoginWithGoogle () {
    const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

    navigateToUrl(`${backendUrl}/auth/google`)
  }
</script>
