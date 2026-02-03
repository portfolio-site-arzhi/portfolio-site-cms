import type { SiteConfigAboutValue, SiteConfigFooterValue, SiteConfigHomeValue, SiteConfigSystemValue } from '@/model/site-config'
import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'
import { fetchSiteConfigsApi } from '@/api/site-config-service'

export const useSiteConfigStore = defineStore('site-config', () => {
  const theme = useTheme()

  const system = ref<SiteConfigSystemValue>({
    primary_color: '#1976D2',
    secondary_color: '#42A5F5',
  })

  const home = ref<SiteConfigHomeValue>({
    name: '',
    position: '',
    description: {
      id: '',
      en: '',
    },
    photo: null,
  })

  const about = ref<SiteConfigAboutValue>({
    about_me: {
      id: '',
      en: '',
    },
    email: '',
  })

  const footer = ref<SiteConfigFooterValue>({
    github: '',
    linkedin: '',
    instagram: '',
  })

  const loaded = ref(false)
  const loading = ref(false)
  let currentFetchPromise: Promise<void> | null = null

  function fetchSiteConfigs (force = false): Promise<void> {
    if (loading.value && currentFetchPromise) {
      return currentFetchPromise
    }

    if (loaded.value && !force) {
      return Promise.resolve()
    }

    loading.value = true

    currentFetchPromise = fetchSiteConfigsApi()
      .then(res => {
        const data = res.data.data

        if (data.system) {
          system.value = data.system
          updateTheme(system.value)
        }

        if (data.home) {
          home.value = {
            name: data.home.name,
            position: data.home.position,
            description: {
              id: data.home.description.id,
              en: data.home.description.en,
            },
            photo: data.home.photo ?? null,
          }
        }

        if (data.about) {
          about.value = {
            about_me: {
              id: data.about.about_me.id,
              en: data.about.about_me.en,
            },
            email: data.about.email,
          }
        }

        if (data.footer) {
          footer.value = {
            github: data.footer.github,
            linkedin: data.footer.linkedin,
            instagram: data.footer.instagram,
          }
        }

        loaded.value = true
      })
      .catch(error => {
        console.error('Failed to fetch site configs', error)
        throw error
      })
      .finally(() => {
        loading.value = false
        currentFetchPromise = null
      })

    return currentFetchPromise
  }

  function updateTheme (config: SiteConfigSystemValue) {
    if (!theme.themes.value.light) {
      return
    }

    if (config.primary_color) {
      theme.themes.value.light.colors.primary = config.primary_color
    }
    if (config.secondary_color) {
      theme.themes.value.light.colors.secondary = config.secondary_color
    }
  }

  function resetTheme () {
    if (!theme.themes.value.light) {
      return
    }
    // Reset to default values or empty
    // Assuming default Vuetify colors or initial values
    theme.themes.value.light.colors.primary = '#1867C0' // Vuetify default or your project default
    theme.themes.value.light.colors.secondary = '#5CBBF6'

    // Also reset state if needed, but user specifically asked to "menghapus data pinianya"
    // when entering login/notfound.
    loaded.value = false
    system.value = {
      primary_color: '#1867C0',
      secondary_color: '#5CBBF6',
    }
  }

  return {
    system,
    home,
    about,
    footer,
    loaded,
    loading,
    fetchSiteConfigs,
    updateTheme,
    resetTheme,
  }
})
