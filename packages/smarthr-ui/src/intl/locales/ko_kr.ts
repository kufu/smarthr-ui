import type { ja } from '.'

// キーと値の間に改行が入ると翻訳システムと連携できなくなるため、prettier-ignoreしている
// prettier-ignore
export const locale = {
  'smarthr-ui/common/language': '한국어',
  'smarthr-ui/Button/loading': '처리중',
  'smarthr-ui/Combobox/loadingText': '',
  'smarthr-ui/Combobox/noResultsText': '일치하는 선택지가 없습니다.',
  'smarthr-ui/DropdownMenuButton/triggerActive': '',
  'smarthr-ui/DropdownMenuButton/triggerInactive': '',
  'smarthr-ui/InputFile/destroy': '',
  'smarthr-ui/RequiredLabel/text': '필수',
  'smarthr-ui/TextLink/openInNewTab': '다른 창으로 열기',
} as const satisfies Record<keyof typeof ja, string>
