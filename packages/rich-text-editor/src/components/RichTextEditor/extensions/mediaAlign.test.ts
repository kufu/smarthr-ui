import { describe, expect, it } from 'vitest'

import {
  IMAGE_ALIGN_STYLES,
  parseImageAlign,
  parseMediaAlign,
  toMediaAlignStyleText,
} from './mediaAlign'

const element = (style: string) => {
  const el = document.createElement('div')
  el.setAttribute('style', style)

  return el
}

describe('parseMediaAlign', () => {
  it.each([
    ['margin-left: auto; margin-right: auto', 'center'],
    ['margin: 0 auto', 'center'],
    ['display: block; margin-left: auto', 'right'],
    ['margin-right: auto', null],
    ['', null],
  ])('%s → %s', (style, expected) => {
    expect(parseMediaAlign(element(style))).toBe(expected)
  })

  it('要素が無ければ null', () => {
    expect(parseMediaAlign(null)).toBeNull()
  })
})

describe('parseImageAlign', () => {
  it.each([
    ['display: block; margin-left: auto; margin-right: auto', 'center'],
    ['display: block; margin: 0 auto', 'center'],
    ['display: block; margin-left: auto', 'right'],
    // インライン表示の画像には margin auto が効かず、元のページでは左に表示されている
    ['margin-left: auto', null],
    ['margin-left: auto; margin-right: auto', null],
  ])('%s → %s', (style, expected) => {
    expect(parseImageAlign(element(style))).toBe(expected)
  })
})

describe('toMediaAlignStyleText', () => {
  it('中央と右の style を返し、それ以外は返さない', () => {
    expect(toMediaAlignStyleText(IMAGE_ALIGN_STYLES, 'center')).toBe(
      'display: block; margin-left: auto; margin-right: auto',
    )
    expect(toMediaAlignStyleText(IMAGE_ALIGN_STYLES, 'right')).toBe(
      'display: block; margin-left: auto',
    )
    expect(toMediaAlignStyleText(IMAGE_ALIGN_STYLES, 'left')).toBeUndefined()
    expect(toMediaAlignStyleText(IMAGE_ALIGN_STYLES, null)).toBeUndefined()
  })
})
