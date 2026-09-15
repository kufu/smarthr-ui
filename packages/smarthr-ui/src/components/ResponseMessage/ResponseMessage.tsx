import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import {
  ERROR_ICON_ALT,
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  type ComponentProps as IconProps,
  SUCCESS_ICON_ALT,
  SYNC_ICON_ALT,
  WARNING_ICON_ALT,
  WarningIcon,
} from '../Icon'
import { Text } from '../Text'

const STATUS_ICON_MAPPER = {
  info: FaCircleInfoIcon,
  success: FaCircleCheckIcon,
  warning: WarningIcon,
  error: FaCircleExclamationIcon,
  sync: FaRotateIcon,
}

// HINT: infoは装飾として扱うため、代替テキストを設定しない
const STATUS_ICON_ALT_MAPPER: Partial<Record<keyof typeof STATUS_ICON_MAPPER, ReactNode>> = {
  success: SUCCESS_ICON_ALT,
  warning: WARNING_ICON_ALT,
  error: ERROR_ICON_ALT,
  sync: SYNC_ICON_ALT,
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
    <Text
      size={size}
      icon={<TextIcon {...rest} alt={STATUS_ICON_ALT_MAPPER[status]} className={className} />}
    >
      {children}
    </Text>
  )
}
