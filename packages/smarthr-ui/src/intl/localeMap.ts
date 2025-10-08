import type * as locales from './locales'

export type Locale = keyof typeof locales

/*
  localeMap は LanguageSwitcher で言語切替をするためにも使用されます。そのため、このオブジェクトの並び順が言語切替 UI の並び順にも反映されます。
  配置ロジック（新しい言語追加時の判断軸）
  ・認知負荷を減らす：利用頻度を考慮し、ユーザーが直感的に探せるようにする。
  ・見栄えを考慮：アルファベット系・漢字系といった系統を意識して並べ、視覚的にも整理する。

  下記の設計を基準にすれば、新しい言語を追加する際も既存の分類に沿って挿入するだけで済み、秩序を維持できる。
  1. 日本語：デフォルト言語のため、常に最上位。
  2. 英語：i18n文脈における事実上のデフォルト言語として、常に第二位。
  3. 他のアルファベット系言語（インドネシア語、ポルトガル語、ベトナム語）：常に中央に配置し、アルファベット順で整列。
  4. 韓国語：アルファベット系と漢字系の橋渡し（トランジション）として配置。
  5. 中国語（簡体字・繁体字）：ユーザー数が多く安定している漢字系言語であるため、常に後半にまとめて配置。
  6. やさしい日本語：日本語の派生であり、補助的な言語という位置づけを示すため、常に最後に配置。
*/
export const localeMap: Record<Locale, string> = {
  ja: '日本語',
  'en-us': 'English',
  'id-id': 'Bahasa Indonesia',
  pt: 'Português',
  vi: 'Tiếng Việt',
  ko: '한국어',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
  'ja-easy': 'やさしい日本語',
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
