export type ExportLocale = 'id' | 'en'

export type ExportDocumentType = 'cv' | 'portfolios'

export interface ExportDocumentOption {
  type: ExportDocumentType
  title: string
  description: string
  helperText: string
  icon: string
  buttonText: string
  buttonIcon: string
  fallbackFileName: string
  successMessage: string
  errorMessage: string
}
