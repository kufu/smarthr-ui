import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type ComponentProps as IconProps, StatusIcon } from '../Icon'
import { LiveRegion } from '../LiveRegion'
import { Text } from '../Text'

type Props = PropsWithChildren<Omit<IconProps, 'size' | 'alt' | 'role'>> & {
  size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
  status?: ComponentPropsWithoutRef<typeof StatusIcon>['status']
  /** role 属性 */
  role?: 'alert' | 'status'
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

const ROLE_STATUS_TYPE_REGEX = /^(info|sync|success)$/

export const ResponseMessage: FC<Props> = ({
  status = 'info',
  size,
  role,
  className,
  children,
  ...rest
}) => {
  const iconClassName = useMemo(() => classNameGenerator({ status }), [status])

  return (
    <Text
      size={size}
      className={className}
      icon={<StatusIcon {...rest} status={status} className={iconClassName} />}
    >
      <LiveRegion
        role={role || (ROLE_STATUS_TYPE_REGEX.test(status) ? 'status' : 'alert')}
        className="shr-contents"
      >
        {children}
      </LiveRegion>
    </Text>
  )
}
