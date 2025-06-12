import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': 'English',
  'smarthr-ui/Button/loading': 'In progress',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': 'No matching options found.',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/FilterDropdown/applyButton': '',
  'smarthr-ui/FilterDropdown/cancelButton': '',
  'smarthr-ui/FilterDropdown/resetButton': '',
  'smarthr-ui/FilterDropdown/status': '',
  'smarthr-ui/FilterDropdown/triggerButton': '',
  'smarthr-ui/RequiredLabel/text': 'Required',
  'smarthr-ui/TextLink/openInNewTab': 'Open in another tab',
} as const satisfies Record<keyof typeof ja, string>
