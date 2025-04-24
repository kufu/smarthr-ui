import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '한국어',
  'smarthr-ui/RequiredLabel/text': '필수',
} as const satisfies Record<keyof typeof ja, string>
