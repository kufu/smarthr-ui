import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': 'Português',
  'smarthr-ui/AppLauncher/showAllText': '',
  'smarthr-ui/AppLauncher/triggerLabel': '',
  'smarthr-ui/Button/loading': 'Processando',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': 'Nenhuma opção correspondente',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/RequiredLabel/text': '',
  'smarthr-ui/SortDropdown/applyButtonLabel': '',
  'smarthr-ui/SortDropdown/ascLabel': '',
  'smarthr-ui/SortDropdown/cancelButtonLabel': '',
  'smarthr-ui/SortDropdown/descLabel': '',
  'smarthr-ui/SortDropdown/sortFieldLabel': '',
  'smarthr-ui/SortDropdown/sortOrderLabel': '',
  'smarthr-ui/TextLink/openInNewTab': 'Abra em uma outra guia',
} as const satisfies Record<keyof typeof ja, string>
