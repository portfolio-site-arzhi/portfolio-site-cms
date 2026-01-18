export interface UserProfile {
  id: number
  email: string
  name: string
  status: boolean
}

export interface AuthState {
  isLoggedIn: boolean
  loadingProfile: boolean
  profile: UserProfile | null
}

export interface ProfileResponse {
  user: UserProfile
}
