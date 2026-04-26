/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { getAuthRedirectPath } from '@/router/auth-guard'
import { useAuthStore } from '@/stores/auth'
import { readIsLoggedInCookie } from '@/utils/auth-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(to => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn || readIsLoggedInCookie()
  const redirectPath = getAuthRedirectPath({
    path: to.path,
    meta: to.meta,
    isLoggedIn,
  })

  if (redirectPath) {
    return { path: redirectPath }
  }

  return true
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
