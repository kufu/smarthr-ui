import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type ComponentProps as IconProps, STATUS_ICON_MAPPER, type StatusIconType } from '../Icon'
import { Text } from '../Text'

type Props = PropsWithChildren<Omit<IconProps, 'size' | 'alt'>> & {
  size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
  status?: StatusIconType
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

export const ResponseMessage: FC<Props> = ({ status = 'info', size, children, ...rest }) => {
  const className = useMemo(() => classNameGenerator({ status }), [status])
  const { Component: TextIcon, alt } = STATUS_ICON_MAPPER[status]

  return (
    <Text size={size} icon={<TextIcon {...rest} alt={alt} className={className} />}>
      {children}
    </Text>
  )
}
