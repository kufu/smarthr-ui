import innerText from 'react-innertext'

import type { ComboboxItem } from './types'

const CHAR_MAP: Record<string, string> = {
  '\u2019': "'", // '
  '\u201C': '"', // "
  '\u201D': '"', // "
  '｀': '`',
  '￥': '¥',
  '−': '-',
  '〜': '~',
}

const NORMALIZE_PATTERN = new RegExp(`[\\s${Object.keys(CHAR_MAP).join('')}]|[！-｝]`, 'g')
const WHITESPACE_PATTERN = /\s/

const normalizeChar = (match: string): string => {
  // 空白文字の正規化
  if (WHITESPACE_PATTERN.test(match)) return ' '

  // マッピングテーブルでの変換
  const mappedMatch = CHAR_MAP[match]
  if (mappedMatch) return mappedMatch

  // 全角英数記号の半角化（unicode で [！] から [｝] の間に定義されている英数・記号を半角に変換）
  const code = match.charCodeAt(0)
  if (code >= 0xff01 && code <= 0xff5d) {
    return String.fromCharCode(code - 0xfee0)
  }

  return match
}

export const convertMatchableString = (original: string) =>
  original.replace(NORMALIZE_PATTERN, normalizeChar).toLowerCase()

export function areItemsEqual<T>(a: ComboboxItem<T>, b: ComboboxItem<T>) {
  return a.value === b.value && innerText(a.label) === innerText(b.label)
}
