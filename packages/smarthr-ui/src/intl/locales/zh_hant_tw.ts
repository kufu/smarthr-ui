import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '繁體中文',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/RequiredLabel/text': '必填',
} as const satisfies Record<keyof typeof ja, string>
