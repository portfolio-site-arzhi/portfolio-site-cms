import { describe, expect, it } from 'vitest'
import { DEFAULT_EXPORT_LOCALE } from '../src/constants/export.constant'

describe('DEFAULT_EXPORT_LOCALE', () => {
  it('menggunakan locale english sebagai default export internal', () => {
    expect(DEFAULT_EXPORT_LOCALE).toBe('en')
  })
})
