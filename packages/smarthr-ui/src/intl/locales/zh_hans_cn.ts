import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '简体中文',
  'smarthr-ui/Button/loading': '处理中',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': '没有符合条件的选项',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/FilterDropdown/applyButton': '',
  'smarthr-ui/FilterDropdown/cancelButton': '',
  'smarthr-ui/FilterDropdown/resetButton': '',
  'smarthr-ui/FilterDropdown/status': '',
  'smarthr-ui/FilterDropdown/triggerButton': '',
  'smarthr-ui/RequiredLabel/text': '必须',
  'smarthr-ui/TextLink/openInNewTab': '在新标签页中打开',
} as const satisfies Record<keyof typeof ja, string>
