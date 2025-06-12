import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': 'Tiếng Việt',
  'smarthr-ui/Button/loading': 'Đang xử lý',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': 'Không có kết quả phù hợp.',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/InputFile/destroy': '',
  'smarthr-ui/RequiredLabel/text': 'Bắt buộc',
  'smarthr-ui/TextLink/openInNewTab': 'Mở trong tab mới',
} as const satisfies Record<keyof typeof ja, string>
