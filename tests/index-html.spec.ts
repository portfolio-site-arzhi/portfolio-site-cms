import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('index.html', () => {
  it('merujuk favicon png dari public directory', () => {
    const indexHtml = readFileSync(resolve(__dirname, '../index.html'), 'utf8')

    expect(indexHtml).toContain('<link rel="icon" type="image/png" href="/logo.png">')
  })

  it('menggunakan title dashboard yang sesuai', () => {
    const indexHtml = readFileSync(resolve(__dirname, '../index.html'), 'utf8')

    expect(indexHtml).toContain('<title>Dashboard My Resume</title>')
  })
})
