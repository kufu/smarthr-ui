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
