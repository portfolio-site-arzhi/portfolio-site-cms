import { getNameInitials } from '@/helper/name-initial'
import { useAuthStore } from '@/stores/auth'

export function useHomePage () {
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

  return {
    profileName,
    profileEmail,
    profileInitial,
    profileStatusText,
  }
}
