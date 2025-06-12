import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '繁體中文',
  'smarthr-ui/Button/loading': '處理中',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': '沒有符合條件的選項',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/FilterDropdown/applyButton': '',
  'smarthr-ui/FilterDropdown/cancelButton': '',
  'smarthr-ui/FilterDropdown/resetButton': '',
  'smarthr-ui/FilterDropdown/status': '',
  'smarthr-ui/FilterDropdown/triggerButton': '',
  'smarthr-ui/RequiredLabel/text': '必填',
  'smarthr-ui/TextLink/openInNewTab': '在新視窗中開啟',
} as const satisfies Record<keyof typeof ja, string>
