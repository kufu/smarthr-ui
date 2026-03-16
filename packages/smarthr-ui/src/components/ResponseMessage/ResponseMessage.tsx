import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  type ComponentProps as IconProps,
  WarningIcon,
} from '../Icon'
import { Text } from '../Text'

import type { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'

type Props = PropsWithChildren<VariantProps<typeof classNameGenerator>> &
  Omit<IconProps, 'size' | 'alt'> & {
    size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
    iconGap?: CharRelativeSize | AbstractSize
    right?: boolean
  }

export const classNameGenerator = tv({
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

export const ResponseMessage: FC<Props> = ({
  type = 'info',
  size,
  iconGap,
  right,
  children,
  ...rest
}) => {
  const className = useMemo(() => classNameGenerator({ type }), [type])
  const Icon = ICON_MAPPER[type]
  const icon = <Icon {...rest} className={className} />
  const iconAttrs = {
    prefix: right ? undefined : icon,
    suffix: right ? icon : undefined,
    gap: iconGap,
  }

  return (
    <Text icon={iconAttrs} size={size}>
      {children}
    </Text>
  )
}
