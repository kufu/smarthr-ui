import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': 'Bahasa Indonesia',
  'smarthr-ui/RequiredLabel/text': 'Wajib',
} as const satisfies Record<keyof typeof ja, string>
