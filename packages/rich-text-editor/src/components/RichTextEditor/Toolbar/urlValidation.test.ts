import { describe, expect, it } from 'vitest'

import { isHttpUrl, isLinkUrl, isMailtoUrl } from './urlValidation'

describe('isHttpUrl', () => {
  it.each([
    'https://example.com/image.png',
    'http://example.com/image.png',
    'HTTPS://EXAMPLE.com/image.png',
    'https://例え.jp/image.png',
    'https://example.com:8080/image.png?v=1#frag',
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

  // URL の解析は正規化して受け付けるが、入力した文字列のまま保存され、サニタイズで落ちる
  it.each([
    'https:/example.com/image.png',
    'https:example.com/image.png',
    'https:\\\\example.com/image.png',
    '\u0000https://example.com/image.png',
  ])('http:// か https:// で始まらない値を弾く: %j', (url) => {
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

  it.each([
    '',
    'mailto:',
    'mailto:   ',
    'https://example.com',
    'foo@example.com',
    '\u0000mailto:foo@example.com',
  ])('宛先のない mailto と mailto 以外を弾く: %s', (url) => {
    expect(isMailtoUrl(url)).toBe(false)
  })
})

describe('isLinkUrl', () => {
  it.each(['https://example.com', 'mailto:foo@example.com'])('%s を受け入れる', (url) => {
    expect(isLinkUrl(url)).toBe(true)
  })

  it.each(['/relative/path', 'ftp://example.com', 'https:example.com', 'mailto:'])(
    '%s を弾く',
    (url) => {
      expect(isLinkUrl(url)).toBe(false)
    },
  )
})
