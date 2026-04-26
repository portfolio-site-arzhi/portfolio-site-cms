function isGuestOnlyRoute (path: string): boolean {
  return path === '/' || path === '/login'
}

function isPublicRoute (meta: Record<string | number | symbol, unknown>): boolean {
  return meta.public === true
}

export function getAuthRedirectPath (options: {
  path: string
  meta: Record<string | number | symbol, unknown>
  isLoggedIn: boolean
}): string | null {
  const guestOnly = isGuestOnlyRoute(options.path)
  const publicRoute = isPublicRoute(options.meta)

  if (guestOnly && options.isLoggedIn) {
    return '/home'
  }

  if (!options.isLoggedIn && !guestOnly && !publicRoute) {
    return '/login'
  }

  return null
}
