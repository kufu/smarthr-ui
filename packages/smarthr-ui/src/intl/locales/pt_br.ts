import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': 'Português',
  'smarthr-ui/RequiredLabel/text': '',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': 'Nenhuma opção correspondente',
} as const satisfies Record<keyof typeof ja, string>
