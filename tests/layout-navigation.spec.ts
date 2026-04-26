import { describe, expect, it } from 'vitest'
import { SIDEBAR_NAV_ITEMS } from '../src/constants/layout.constant'

describe('SIDEBAR_NAV_ITEMS', () => {
  it('menempatkan menu portfolio di urutan paling bawah', () => {
    expect(SIDEBAR_NAV_ITEMS.at(-1)).toEqual({
      title: 'Portfolio',
      icon: 'mdi-folder-multiple-image',
      to: '/portfolios',
    })
  })
})
