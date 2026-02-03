export type SnackbarColor = 'success' | 'error' | 'info'

export interface SnackbarState {
  visible: boolean
  message: string
  color: SnackbarColor
  timeout: number
}

export interface AppState {
  snackbar: SnackbarState
}
