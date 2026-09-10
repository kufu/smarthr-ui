import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  FaTriangleExclamationIcon,
  WarningIcon,
} from '../components/Icon'
import { Localizer } from '../intl'

// HINT: warningのアイコンはboldかどうかで出し分けるが、代替テキストは共通のため切り出している
const WARNING_ALT = <Localizer id="smarthr-ui/statusIcon/warningAlt" defaultText="注意" />

const BASE_STATUS_ICON_MAPPER = {
  // HINT: infoは装飾として扱うため、代替テキストを設定しない
  info: { Component: FaCircleInfoIcon, alt: undefined },
  success: {
    Component: FaCircleCheckIcon,
    alt: <Localizer id="smarthr-ui/statusIcon/successAlt" defaultText="成功" />,
  },
  error: {
    Component: FaCircleExclamationIcon,
    alt: <Localizer id="smarthr-ui/statusIcon/errorAlt" defaultText="エラー" />,
  },
  sync: {
    Component: FaRotateIcon,
    alt: <Localizer id="smarthr-ui/statusIcon/syncAlt" defaultText="実行中" />,
  },
}

export const STATUS_ICON_MAPPER = {
  ...BASE_STATUS_ICON_MAPPER,
  warning: { Component: WarningIcon, alt: WARNING_ALT },
}

export const BOLD_STATUS_ICON_MAPPER = {
  ...BASE_STATUS_ICON_MAPPER,
  warning: { Component: FaTriangleExclamationIcon, alt: WARNING_ALT },
}

export type StatusIconType = keyof typeof STATUS_ICON_MAPPER
