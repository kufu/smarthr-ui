'use client'

import { memo, useMemo } from 'react'

import { useIntl } from '../../intl'

import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  FaTriangleExclamationIcon,
} from './FaIcon'
import { WarningIcon } from './WarningIcon'

import type { Props as IconProps } from './generateIcon'

const ICON_MAPPER = {
  // HINT: infoは装飾として扱うため、代替テキストを設定しない
  info: { Component: FaCircleInfoIcon, alt: undefined },
  success: {
    Component: FaCircleCheckIcon,
    alt: { id: 'smarthr-ui/StatusIcon/successAlt', defaultText: '成功' },
  },
  warning: {
    Component: WarningIcon,
    alt: { id: 'smarthr-ui/StatusIcon/warningAlt', defaultText: '注意' },
  },
  error: {
    Component: FaCircleExclamationIcon,
    alt: { id: 'smarthr-ui/StatusIcon/errorAlt', defaultText: 'エラー' },
  },
  sync: {
    Component: FaRotateIcon,
    alt: { id: 'smarthr-ui/StatusIcon/syncAlt', defaultText: '実行中' },
  },
} as const

// HINT: WarningIconは自身で色を持っているため、色を変えられないためFA Iconを利用している
const BOLD_ICON_MAPPER = {
  ...ICON_MAPPER,
  warning: { Component: FaTriangleExclamationIcon, alt: ICON_MAPPER.warning.alt },
} as const

type BaseProps = {
  /** アイコンが表す状態 */
  status: keyof typeof ICON_MAPPER
  /** `true` のとき、背景に色が付く場面向けに単色のアイコンを使う（warningのみ変化する） */
  bold?: boolean
}
type Props = BaseProps & Omit<IconProps, keyof BaseProps | 'alt'>

export const StatusIcon = memo<Props>(({ status, bold, ...rest }) => {
  const { localize } = useIntl()

  const { Component, alt } = (bold ? BOLD_ICON_MAPPER : ICON_MAPPER)[status]
  const actualAlt = useMemo(() => (alt ? localize(alt) : undefined), [alt, localize])

  return <Component {...rest} alt={actualAlt} />
})
