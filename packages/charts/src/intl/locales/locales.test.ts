import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { locale as ja } from './ja'

const localesDir = path.dirname(fileURLToPath(import.meta.url))

const readLocaleJson = (fileName: string): Record<string, string> =>
  JSON.parse(readFileSync(path.join(localesDir, fileName), 'utf8'))

// Crowdinの翻訳対象になっている辞書ファイル
const TRANSLATION_FILE_NAMES = [
  'en_us.json',
  'id_id.json',
  'ja_easy.json',
  'ko_kr.json',
  'pt_br.json',
  'vi_vn.json',
  'zh_hans_cn.json',
  'zh_hant_tw.json',
]

describe('locales', () => {
  it('ja.jsonがja.tsと同期されている', () => {
    // 同期はeslintのautofix（smarthr/require-i18n-translation-sync）で行われるため、
    // 実行されないままcommitされていないことを検証する
    expect(readLocaleJson('ja.json')).toEqual(ja)
  })

  it('ja以外の辞書は、jaに存在するキーのみを持つ', () => {
    const jaKeys = new Set(Object.keys(ja))
    const unknownKeys = TRANSLATION_FILE_NAMES.flatMap((fileName) =>
      Object.keys(readLocaleJson(fileName))
        .filter((key) => !jaKeys.has(key))
        .map((key) => `${fileName}: ${key}`),
    )

    expect(unknownKeys).toEqual([])
  })
})
