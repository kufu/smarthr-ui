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

const STATUS_ICON_MAPPER = {
  info: FaCircleInfoIcon,
  success: FaCircleCheckIcon,
  warning: WarningIcon,
  error: FaCircleExclamationIcon,
  sync: FaRotateIcon,
} as const

// TODO: LiveRegionを内部で呼び出すように修正する
// 利用している他コンポーネントで調整が必要なため、専用PRで対応
export const ResponseMessage: FC<Props> = ({ status = 'info', size, children, ...rest }) => {
  const className = useMemo(() => classNameGenerator({ status }), [status])
  const TextIcon = STATUS_ICON_MAPPER[status]

  return (
    <Text size={size} icon={<TextIcon {...rest} className={className} />}>
      {children}
    </Text>
  )
}
