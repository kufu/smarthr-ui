import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
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

const STATUS_ICON_MAPPER = {
  // HINT: infoは装飾として扱うため、代替テキストを設定しない
  info: { Component: FaCircleInfoIcon, alt: undefined },
  success: {
    Component: FaCircleCheckIcon,
    alt: <Localizer id="smarthr-ui/statusIcon/successAlt" defaultText="成功" />,
  },
  warning: {
    Component: WarningIcon,
    alt: <Localizer id="smarthr-ui/statusIcon/warningAlt" defaultText="注意" />,
  },
  error: {
    Component: FaCircleExclamationIcon,
    alt: <Localizer id="smarthr-ui/statusIcon/errorAlt" defaultText="エラー" />,
  },
  sync: {
    Component: FaRotateIcon,
    alt: <Localizer id="smarthr-ui/statusIcon/syncAlt" defaultText="実行中" />,
  },
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

export const ResponseMessage: FC<Props> = ({
  status = 'info',
  size,
  role,
  className,
  children,
  ...rest
}) => {
  const iconClassName = useMemo(() => classNameGenerator({ status }), [status])
  const { Component: TextIcon, alt } = STATUS_ICON_MAPPER[status]

  return (
    <Text
      size={size}
      className={className}
      icon={<TextIcon {...rest} alt={alt} className={iconClassName} />}
    >
      <LiveRegion role={role} className="shr-contents">
        {children}
      </LiveRegion>
    </Text>
  )
}
