import { type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  type ComponentProps as IconProps,
  WarningIcon,
} from '../Icon'

type Props = PropsWithChildren<VariantProps<typeof classNameGenerator>> & Omit<IconProps, 'text'>

const classNameGenerator = tv({
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
} as const

export const ResponseMessage: FC<Props> = ({ type = 'info', children, ...other }) => {
  const className = useMemo(() => classNameGenerator({ type }), [type])
  const Icon = ICON_MAPPER[type]

  return <Icon {...other} text={children} className={className} />
}
