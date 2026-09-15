import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import {
  ErrorIcon,
  FaCircleInfoIcon,
  type ComponentProps as IconProps,
  SuccessIcon,
  SyncIcon,
  WarningIcon,
} from '../Icon'
import { Text } from '../Text'

const STATUS_ICON_MAPPER = {
  // HINT: infoは装飾として扱うため、代替テキストを設定しない
  info: FaCircleInfoIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  sync: SyncIcon,
}

type Props = PropsWithChildren<Omit<IconProps, 'size' | 'alt'>> & {
  size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
  status?: keyof typeof STATUS_ICON_MAPPER
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
  const TextIcon = STATUS_ICON_MAPPER[status]

  return (
    <Text size={size} icon={<TextIcon {...rest} className={className} />}>
      {children}
    </Text>
  )
}
