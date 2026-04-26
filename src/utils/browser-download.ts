import type { AxiosResponse } from 'axios'

type HeaderValue = string | string[] | number | boolean | null | undefined

type AxiosHeaderLike = Record<string, HeaderValue> & {
  get?: (name: string) => HeaderValue
}

function normalizeHeaderValue (value: HeaderValue): string | null {
  if (Array.isArray(value)) {
    return value.length > 0 ? String(value[0]) : null
  }

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return null
}

function readHeaderValue (headers: AxiosResponse<Blob>['headers'], name: string): string | null {
  const headerSource = headers as AxiosHeaderLike | undefined

  if (!headerSource) {
    return null
  }

  if (typeof headerSource.get === 'function') {
    return normalizeHeaderValue(headerSource.get(name))
  }

  return normalizeHeaderValue(headerSource[name])
}

export function extractAttachmentFileName (response: AxiosResponse<Blob>, fallbackFileName: string): string {
  const disposition = readHeaderValue(response.headers, 'content-disposition')

  if (!disposition) {
    return fallbackFileName
  }

  const encodedMatch = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)
  if (encodedMatch && encodedMatch[1]) {
    try {
      return decodeURIComponent(encodedMatch[1])
    } catch {
      return encodedMatch[1]
    }
  }

  const plainMatch = disposition.match(/filename\s*=\s*"([^"]+)"/i) ?? disposition.match(/filename\s*=\s*([^;]+)/i)
  if (plainMatch && plainMatch[1]) {
    return plainMatch[1].trim()
  }

  return fallbackFileName
}

export function triggerBrowserDownload (fileBlob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(fileBlob)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.style.display = 'none'

  document.body.append(anchor)

  try {
    anchor.click()
  } finally {
    anchor.remove()
    URL.revokeObjectURL(objectUrl)
  }
}
