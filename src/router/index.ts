/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { useAuthStore } from '@/stores/auth'
import { readIsLoggedInCookie } from '@/utils/auth-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

function isGuestOnlyRoute (path: string): boolean {
  if (path === '/login') {
    return true
  }

  if (path === '/') {
    return true
  }

  return false
}

function isPublicRoute (meta: Record<string | number | symbol, unknown>): boolean {
  if (meta.public === true) {
    return true
  }

  return false
}

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn || readIsLoggedInCookie()

  const guestOnly = isGuestOnlyRoute(to.path)
  const publicRoute = isPublicRoute(to.meta)

  if (guestOnly && isLoggedIn) {
    next({ path: '/home' })

    return
  }

  if (!isLoggedIn && !guestOnly && !publicRoute) {
    next({ path: '/login' })

    return
  }

  next()
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.error('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
