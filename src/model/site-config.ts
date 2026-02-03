export interface MultiLangString {
  id: string
  en: string
}

export interface SiteConfigSystemValue {
  primary_color: string
  secondary_color: string
}

export interface SiteConfigHomeValue {
  name: string
  position: string
  description: MultiLangString
  photo: string | null
}

export interface SiteConfigAboutValue {
  about_me: MultiLangString
  email: string
}

export interface SiteConfigFooterValue {
  github: string
  linkedin: string
  instagram: string
}

export interface SiteConfigResponseData {
  system: SiteConfigSystemValue | null
  home: SiteConfigHomeValue | null
  about: SiteConfigAboutValue | null
  footer: SiteConfigFooterValue | null
}

export interface SiteConfigListResponse {
  data: SiteConfigResponseData
}

export interface SiteConfigBulkPayload {
  system: SiteConfigSystemValue
  home: SiteConfigHomeValue & {
    status_file?: number
  }
  about: SiteConfigAboutValue
  footer: SiteConfigFooterValue
}

export interface SiteConfigFormValues {
  system: SiteConfigSystemValue
  home: SiteConfigHomeValue & {
    status_file: number
    photo: string
  }
  about: SiteConfigAboutValue
  footer: SiteConfigFooterValue
}
