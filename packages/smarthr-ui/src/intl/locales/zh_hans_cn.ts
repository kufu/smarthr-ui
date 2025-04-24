import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '简体中文',
  'smarthr-ui/RequiredLabel/text': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
} as const satisfies Record<keyof typeof ja, string>
