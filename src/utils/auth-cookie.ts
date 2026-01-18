import Cookies from 'js-cookie'

export function readIsLoggedInCookie (): boolean {
  const value = Cookies.get('is_logged_in')

  return value === 'true'
}

export function clearIsLoggedInCookie (): void {
  Cookies.remove('is_logged_in', { path: '/' })
}
