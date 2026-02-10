import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
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

type IconType = keyof typeof ICON_MAPPER
type ObjectIconType = {
  type: IconType
  gap?: CharRelativeSize | AbstractSize
}
type Props = PropsWithChildren<Omit<IconProps, 'size' | 'alt'>> & {
  size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
  icon?: IconType | ObjectIconType
}

const iconObjectConverter = (iconType: IconType): ObjectIconType => ({
  type: iconType,
})

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

export const ResponseMessage: FC<Props> = ({ icon: orgIcon = 'info', size, children, ...rest }) => {
  const { type, gap } = useObjectAttributes<IconType | ObjectIconType, ObjectIconType>(
    orgIcon,
    iconObjectConverter,
  )
  const className = useMemo(() => classNameGenerator({ type }), [type])
  const TextIcon = ICON_MAPPER[type]

  return (
    <Text icon={{ prefix: <TextIcon {...rest} className={className} />, gap }} size={size}>
      {children}
    </Text>
  )
}
