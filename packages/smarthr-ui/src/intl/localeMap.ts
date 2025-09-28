import type * as locales from './locales'

export type Locale = keyof typeof locales

export const localeMap: Record<Locale, string> = {
  ja: '日本語',
  'ja-easy': 'やさしい日本語',
  'en-us': 'English',
  ko: '한국어',
  pt: 'Português',
  vi: 'Tiếng Việt',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
  'id-id': 'Bahasa Indonesia',
}

// 渡される言語の揺れを許容して smarthr-ui で使っている言語コードに変換する
export const convertLang = (rawLang: string): keyof typeof locales => {
  const lang = rawLang.toLowerCase().replace(/_/g, '-')

  // 日本語とやさしい日本語の対応
  if (lang.startsWith('ja')) {
    if (lang.includes('-easy')) {
      return 'ja-easy'
    }

    return 'ja'
  }

  // 简体中文と繁體中文
  if (lang.startsWith('zh')) {
    const regionOrScript = lang.split('-')[1] ?? ''

    if (['tw', 'hant'].includes(regionOrScript)) {
      return 'zh-tw'
    }

    return 'zh-cn'
  }

  if (lang.startsWith('en')) return 'en-us' // 英語
  if (lang.startsWith('pt')) return 'pt' // ポルトガル語
  if (lang.startsWith('vi')) return 'vi' // ベトナム語
  if (lang.startsWith('ko')) return 'ko' // 韓国語
  if (lang.startsWith('id')) return 'id-id' // インドネシア語

  // 何にも一致しない場合はフォールバックとして 'ja' を返す
  return 'ja'
}
