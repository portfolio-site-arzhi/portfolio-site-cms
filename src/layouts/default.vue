<template>
  <v-layout v-if="!isPublicLayout">
    <v-navigation-drawer
      v-model="drawer"
      app
      :permanent="!smAndDown"
      :temporary="smAndDown"
    >
      <v-list
        density="compact"
        nav
      >
        <v-list-item>
          <template #prepend>
            <v-avatar color="primary">
              <span class="text-subtitle-2 text-white">
                {{ profileInitial }}
              </span>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-medium">
            {{ profileName }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-medium-emphasis">
            {{ profileEmail }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-divider class="my-2" />

        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          link
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      density="comfortable"
      elevation="1"
    >
      <v-btn
        icon
        variant="text"
        @click="drawer = !drawer"
      >
        <v-icon icon="mdi-menu" />
      </v-btn>

      <v-toolbar-title class="text-h6">
        CMS Portfolio
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        color="on-primary"
        variant="text"
        @click="showLogoutConfirm = true"
      >
        <v-icon
          icon="mdi-logout"
          start
        />
        Logout
      </v-btn>
    </v-app-bar>

    <v-main class="pb-16">
      <router-view />
    </v-main>
  </v-layout>

  <v-main v-else>
    <router-view />
  </v-main>

  <AppFooter v-if="!isPublicLayout" />

  <v-snackbar
    v-model="snackbar.visible"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
  >
    {{ snackbar.message }}
  </v-snackbar>

  <ConfirmDialog
    v-model="showLogoutConfirm"
    cancel-text="Batal"
    confirm-color="primary"
    confirm-text="Logout"
    message="Apakah Anda yakin ingin logout dari CMS?"
    title="Konfirmasi logout"
    @confirm="onLogout"
  />
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import { SIDEBAR_NAV_ITEMS } from '@/constants/layout.constant'
  import { getNameInitials } from '@/helper/name-initial'
  import { useAppStore } from '@/stores/app'
  import { useAuthStore } from '@/stores/auth'
  import { useSiteConfigStore } from '@/stores/site-config'

  const route = useRoute()
  const authStore = useAuthStore()
  const appStore = useAppStore()
  const siteConfigStore = useSiteConfigStore()
  const { smAndDown } = useDisplay()

  const { snackbar } = storeToRefs(appStore)

  const drawer = ref(!smAndDown.value)
  const showLogoutConfirm = ref(false)
  const profile = computed(() => authStore.profile)

  const isPublicLayout = computed(() => route.matched.some(record => record.meta.public === true))

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

  onMounted(() => {
    if (!profile.value && authStore.isLoggedIn) {
      authStore.fetchProfile().catch(() => {
        //
      })
    }

    if (!siteConfigStore.loaded) {
      siteConfigStore.fetchSiteConfigs()
    }
  })

  watch(
    () => route.path,
    () => {
      // If we are on public layout (login, 404, etc), reset theme
      if (isPublicLayout.value) {
        siteConfigStore.resetTheme()
      } else if (siteConfigStore.loaded) {
        // If coming back to authenticated pages and data is loaded, re-apply theme
        siteConfigStore.updateTheme(siteConfigStore.system)
      } else {
        // If not loaded, fetch it
        siteConfigStore.fetchSiteConfigs()
      }
    },
    { immediate: true },
  )

  watch(smAndDown, value => {
    if (value) {
      drawer.value = false
      return
    }

    drawer.value = true
  })

  function onLogout (): void {
    authStore.logout().catch(() => {
      //
    })
  }

  const navItems = SIDEBAR_NAV_ITEMS
</script>
