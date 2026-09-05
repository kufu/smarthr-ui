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
import { LiveRegion } from '../LiveRegion'
import { Text } from '../Text'

type Props = PropsWithChildren<Omit<IconProps, 'size' | 'alt'>> & {
  size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
  status?: keyof typeof STATUS_ICON_MAPPER
  htmlFor?: string
}

export const classNameGenerator = tv({
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
  role,
  htmlFor,
  className,
  children,
  ...rest
}) => {
  const iconClassName = useMemo(() => classNameGenerator({ status }), [status])
  const TextIcon = STATUS_ICON_MAPPER[status]

  return (
    <Text size={size} className={className} icon={<TextIcon {...rest} className={iconClassName} />}>
      <LiveRegion role={role} htmlFor={htmlFor} className="shr-contents">
        {children}
      </LiveRegion>
    </Text>
  )
}
