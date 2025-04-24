import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '한국어',
  'smarthr-ui/RequiredLabel/text': '',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': '일치하는 선택지가 없습니다.',
} as const satisfies Record<keyof typeof ja, string>
