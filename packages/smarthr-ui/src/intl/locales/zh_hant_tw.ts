import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '繁體中文',
  'smarthr-ui/RequiredLabel/text': '',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': '沒有符合條件的選項',
} as const satisfies Record<keyof typeof ja, string>
