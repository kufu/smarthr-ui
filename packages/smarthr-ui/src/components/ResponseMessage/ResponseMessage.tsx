import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  isValidElement,
  useMemo,
} from 'react'
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

import type { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'

type IconType = keyof typeof ICON_MAPPER
type ObjectIconType = {
  type: IconType
  gap?: CharRelativeSize | AbstractSize
}
type Props = PropsWithChildren<Omit<IconProps, 'right' | 'text' | 'size' | 'alt' | 'iconGap'>> & {
  size?: Extract<ComponentPropsWithoutRef<typeof Text>['size'], 'XS' | 'S' | 'M'>
  icon?: IconType | ObjectIconType
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

export const ResponseMessage: FC<Props> = ({ icon, size, children, ...other }) => {
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const actualIcon: ObjectIconType =
    !icon || typeof icon !== 'object' || isValidElement(icon)
      ? {
          type: icon as IconType,
        }
      : (icon as ObjectIconType)

  const className = useMemo(() => classNameGenerator({ type: actualIcon.type }), [actualIcon.type])
  const TextIcon = ICON_MAPPER[actualIcon.type || 'info']

  return (
    <Text
      icon={{ prefix: <TextIcon {...other} className={className} />, gap: actualIcon.gap }}
      size={size}
    >
      {children}
    </Text>
  )
}
