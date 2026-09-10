import { describe, expect, it } from 'vitest'

import { matchesMimeType } from './mimeTypes'

describe('matchesMimeType', () => {
  it.each(['image/png', 'image/jpeg', 'image/svg+xml'])(
    'ワイルドカードは同じ type のサブタイプすべてに一致する: %s',
    (fileType) => {
      expect(matchesMimeType(fileType, ['image/*'])).toBe(true)
    },
  )

  it.each(['application/pdf', 'text/plain', 'video/mp4'])(
    'ワイルドカードは別の type には一致しない: %s',
    (fileType) => {
      expect(matchesMimeType(fileType, ['image/*'])).toBe(false)
    },
  )

  it('完全な MIME type は従来どおり完全一致で判定する', () => {
    expect(matchesMimeType('image/png', ['image/png', 'image/gif'])).toBe(true)
    expect(matchesMimeType('image/webp', ['image/png', 'image/gif'])).toBe(false)
  })

  it('ワイルドカードと完全な MIME type を混在できる', () => {
    expect(matchesMimeType('image/png', ['application/pdf', 'image/*'])).toBe(true)
    expect(matchesMimeType('application/pdf', ['application/pdf', 'image/*'])).toBe(true)
    expect(matchesMimeType('video/mp4', ['application/pdf', 'image/*'])).toBe(false)
  })

  it('type の一部が前方一致するだけでは一致しない', () => {
    expect(matchesMimeType('imagex/png', ['image/*'])).toBe(false)
  })

  it('許可リストが空なら何も通さない', () => {
    expect(matchesMimeType('image/png', [])).toBe(false)
  })
})
