import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': 'Bahasa Indonesia',
  'smarthr-ui/ActionDialog/closeButtonLabel': 'Batal',
  'smarthr-ui/AppLauncher/showAllText': '',
  'smarthr-ui/AppLauncher/triggerLabel': '',
  'smarthr-ui/Button/loading': 'Sedang diproses',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': 'Tidak ada pilihan yang cocok',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/DropZone/selectButtonLabel': '',
  'smarthr-ui/FilterDropdown/applyButton': '',
  'smarthr-ui/FilterDropdown/cancelButton': '',
  'smarthr-ui/FilterDropdown/resetButton': '',
  'smarthr-ui/FilterDropdown/status': '',
  'smarthr-ui/FilterDropdown/triggerButton': '',
  'smarthr-ui/InformationPanel/closeButtonLabel': '',
  'smarthr-ui/InformationPanel/openButtonLabel': '',
  'smarthr-ui/InputFile/destroy': '',
  'smarthr-ui/MultiCombobox/destroyButtonIconAltSuffix': '',
  'smarthr-ui/MultiCombobox/selectedListAriaLabel': '',
  'smarthr-ui/RequiredLabel/text': 'Wajib',
  'smarthr-ui/SortDropdown/applyButtonLabel': '',
  'smarthr-ui/SortDropdown/ascLabel': '',
  'smarthr-ui/SortDropdown/cancelButtonLabel': '',
  'smarthr-ui/SortDropdown/descLabel': '',
  'smarthr-ui/SortDropdown/sortFieldLabel': '',
  'smarthr-ui/SortDropdown/sortOrderLabel': '',
  'smarthr-ui/TextLink/openInNewTab': '',
} as const satisfies Record<keyof typeof ja, string>
