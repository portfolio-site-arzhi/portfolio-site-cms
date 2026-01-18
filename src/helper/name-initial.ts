export function getNameInitials (name: string): string {
  const trimmed = name.trim()

  if (!trimmed) {
    return ''
  }

  const parts = trimmed.split(/\s+/).filter(Boolean)
  const firstPart = parts[0]

  if (!firstPart) {
    return ''
  }

  if (parts.length === 1) {
    return firstPart.charAt(0).toUpperCase()
  }

  const secondPart = parts[1]

  if (!secondPart) {
    return firstPart.charAt(0).toUpperCase()
  }

  const first = firstPart.charAt(0)
  const second = secondPart.charAt(0)

  return `${first}${second}`.toUpperCase()
}
