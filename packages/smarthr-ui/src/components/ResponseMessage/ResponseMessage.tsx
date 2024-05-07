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

export const ResponseMessage: React.FC<Props> = ({ type = 'info', children, ...other }) => {
  const styles = useMemo(() => responseMessage({ type }), [type])
  const Icon = useMemo(() => {
    switch (type) {
      case 'info':
        return FaCircleInfoIcon
      case 'success':
        return FaCircleCheckIcon
      case 'warning':
        return WarningIcon
      case 'error':
        return FaCircleExclamationIcon
      case 'sync':
        return FaRotateIcon
    }
  }, [type])

  return <Icon {...other} text={children} className={styles} />
}
