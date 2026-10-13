import { describe, expect, it } from 'vitest'

import { isHttpUrl, isMailtoUrl } from './urlValidation'

describe('isHttpUrl', () => {
  it.each([
    'https://example.com/image.png',
    'http://example.com/image.png',
    'HTTPS://EXAMPLE.com/image.png',
    'https://例え.jp/image.png',
    'https://example.com:8080/image.png?v=1#frag',
    // URL解析はスラッシュが1つ足りない形をブラウザと同じく正規化する
    'https:/example.com/image.png',
  ])('URLとして成立する http/https を受け入れる: %s', (url) => {
    expect(isHttpUrl(url)).toBe(true)
  })

  it.each([
    '',
    'https://',
    'http://',
    'https://ex ample.com/image.png',
    '/images/image.png',
    '//example.com/image.png',
    'example.com/image.png',
    'https:javascript:alert(1)',
  ])('URLとして成立しない値を弾く: %s', (url) => {
    expect(isHttpUrl(url)).toBe(false)
  })

  it.each([
    'javascript:alert(1)',
    ' javascript:alert(1)',
    'java\nscript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'ｊａｖａｓｃｒｉｐｔ:alert(1)',
    'vbscript:msgbox(1)',
    'data:image/png;base64,AAA',
    'blob:https://example.com/0f8a3c1e',
    'file:///etc/passwd',
    'ftp://example.com/image.png',
  ])('http/https 以外のスキームを弾く: %s', (url) => {
    expect(isHttpUrl(url)).toBe(false)
  })
})

describe('isMailtoUrl', () => {
  it.each([
    'mailto:foo@example.com',
    'mailto:foo@example.com?subject=hello',
    'MAILTO:foo@example.com',
  ])('宛先のある mailto を受け入れる: %s', (url) => {
    expect(isMailtoUrl(url)).toBe(true)
  })

  it.each(['', 'mailto:', 'mailto:   ', 'https://example.com', 'foo@example.com'])(
    '宛先のない mailto と mailto 以外を弾く: %s',
    (url) => {
      expect(isMailtoUrl(url)).toBe(false)
    },
  )
})
