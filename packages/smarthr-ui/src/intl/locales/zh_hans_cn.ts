import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '简体中文',
  'smarthr-ui/Button/loading': '处理中',
  'smarthr-ui/RequiredLabel/text': '',
} as const satisfies Record<keyof typeof ja, string>
