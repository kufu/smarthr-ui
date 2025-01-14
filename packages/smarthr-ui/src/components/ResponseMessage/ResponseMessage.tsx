import React, { PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  type ComponentProps as IconProps,
  WarningIcon,
} from '../Icon'

type Props = PropsWithChildren<VariantProps<typeof responseMessage>> & Omit<IconProps, 'text'>

const responseMessage = tv({
  base: '',
  variants: {
    type: {
      info: 'shr-fill-grey',
      success: 'shr-fill-main',
      warning: '',
      error: 'shr-fill-danger',
      sync: 'shr-fill-main',
    },
  },
})

const ICON_MAPPER = {
  info: FaCircleInfoIcon,
  success: FaCircleCheckIcon,
  warning: WarningIcon,
  error: FaCircleExclamationIcon,
  sync: FaRotateIcon,
}

export const ResponseMessage: React.FC<Props> = ({ type = 'info', children, ...other }) => {
  const styles = useMemo(() => responseMessage({ type }), [type])
  const Icon = ICON_MAPPER[type]

  return <Icon {...other} text={children} className={styles} />
}
