import { describe, expect, it } from 'vitest'

import { normalizeFontSize } from './normalizeFontSize'

describe('normalizeFontSize', () => {
  it.each([
    ['20px', '1.25rem'],
    ['12px', '0.75rem'],
    ['14.5px', '0.9063rem'],
    // Google ドキュメントから貼り付けると pt で入ってくる
    ['11pt', '0.9167rem'],
    ['9pt', '0.75rem'],
    ['1.25rem', '1.25rem'],
    ['0.91666rem', '0.9167rem'],
  ])('%s を %s にそろえる', (input, expected) => {
    expect(normalizeFontSize(input)).toBe(expected)
  })

  it('単位の大文字小文字と前後の空白は問わない', () => {
    expect(normalizeFontSize(' 11PT ')).toBe('0.9167rem')
  })

  it.each([
    // 親要素に依存するため換算できない。見出しの中の 1em を 1rem にすると本文の大きさに縮む
    '150%',
    '1.5em',
    '1em',
    'small',
    'larger',
    'calc(1rem + 2px)',
    '0px',
    '12px;position:fixed',
    '',
  ])('%s は null にする', (input) => {
    expect(normalizeFontSize(input)).toBeNull()
  })

  it.each([null, undefined, 12])('文字列以外（%s）は null にする', (input) => {
    expect(normalizeFontSize(input)).toBeNull()
  })
})
