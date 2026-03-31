import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  type ComponentProps as IconProps,
  WarningIcon,
} from '../Icon'
import { Text } from '../Text'

import type { AbstractSize, CharRelativeSize } from '../../themes'

type Props = PropsWithChildren<Omit<IconProps, 'size' | 'alt'>> & {
  size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
  status?: keyof typeof STATUS_ICON_MAPPER
  iconGap?: CharRelativeSize | AbstractSize
  right?: boolean
}

const classNameGenerator = tv({
  base: '',
  variants: {
    status: {
      info: 'shr-fill-grey',
      success: 'shr-fill-main',
      warning: '',
      error: 'shr-fill-danger',
      sync: 'shr-fill-main',
    },
  },
})

const STATUS_ICON_MAPPER = {
  info: FaCircleInfoIcon,
  success: FaCircleCheckIcon,
  warning: WarningIcon,
  error: FaCircleExclamationIcon,
  sync: FaRotateIcon,
} as const

export const ResponseMessage: FC<Props> = ({
  status = 'info',
  size,
  iconGap,
  right,
  children,
  ...rest
}) => {
  const className = useMemo(() => classNameGenerator({ status }), [status])
  const Icon = STATUS_ICON_MAPPER[status]
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
