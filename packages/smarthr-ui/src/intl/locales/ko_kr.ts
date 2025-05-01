import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '한국어',
  'smarthr-ui/RequiredLabel/text': '',
  'smarthr-ui/TextLink/openInNewTab': '다른 창으로 열기',
} as const satisfies Record<keyof typeof ja, string>
