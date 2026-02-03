import type { AppState, SnackbarColor } from '@/model/app'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    snackbar: {
      visible: false,
      message: '',
      color: 'success',
      timeout: 3000,
    },
  }),
  actions: {
    showSnackbar (message: string, color: SnackbarColor = 'success'): void {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.visible = true
    },
    showSuccess (message: string): void {
      this.showSnackbar(message, 'success')
    },
    showError (message: string): void {
      this.showSnackbar(message, 'error')
    },
    hideSnackbar (): void {
      this.snackbar.visible = false
    },
  },
})
