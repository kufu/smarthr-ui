import innerText from 'react-innertext'

import type { ComboboxItem } from './types'

const CHAR_MAP: Record<string, string> = {
  '\u2019': "'", // ’
  '\u201C': '"', // “
  '\u201D': '"', // ”
  '｀': '`',
  '￥': '¥',
  '−': '-',
  '〜': '~',
}

// 変換対象：空白・特殊な全角記号（マップ変換用）および Unicode [！]〜[｝] の全角英数記号
// ※ [−]（全角マイナス）は正規表現の範囲指定ハイフンと誤認されないよう、エスケープなしで安全な位置に配置
const NORMALIZE_PATTERN = /[\s’“”｀￥−〜\uFF01-\uFF5D]/g
const WHITESPACE_PATTERN = /\s/

const normalizeChar = (match: string): string => {
  // 空白文字の正規化
  if (WHITESPACE_PATTERN.test(match)) return ' '

  // マッピングテーブルでの変換
  const mappedMatch = CHAR_MAP[match]
  if (mappedMatch !== undefined) return mappedMatch

  // 全角英数記号の半角化
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
