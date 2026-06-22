export function openFileInput (input: HTMLInputElement | null): void {
  if (!input) {
    return
  }

  input.value = ''
  input.click()
}

export function readSingleFileFromChangeEvent (event: Event): File | null {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.item(0) ?? null

  if (input) {
    input.value = ''
  }

  return file
}

export function readSingleFileFromDropEvent (event: DragEvent): File | null {
  return event.dataTransfer?.files?.item(0) ?? null
}
