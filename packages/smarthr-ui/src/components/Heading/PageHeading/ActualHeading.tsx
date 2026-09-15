import { type FC, type ReactNode, type Ref, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { STYLE_TYPE_MAP, Text, type TextProps } from '../../Text'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import type { ElementProps } from '../client'

const classNameGenerator = tv({
  base: 'smarthr-ui-Heading smarthr-ui-PageHeading',
  variants: {
    visuallyHidden: {
      false: 'shr-m-[unset]',
    },
  },
  defaultVariants: {
    visuallyHidden: false,
  },
})

export type ActualHeadingProps = {
  visuallyHidden?: boolean
  size: TextProps['size']
  className?: string
  children: ReactNode
  headingRef?: Ref<HTMLHeadingElement>
} & Omit<ElementProps, 'size' | 'className' | 'visuallyHidden' | 'children' | 'ref'>

export const ActualHeading: FC<ActualHeadingProps> = ({
  visuallyHidden,
  size,
  className,
  children,
  headingRef,
  ...rest
}) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ visuallyHidden, className }),
    [className, visuallyHidden],
  )
  const Component = visuallyHidden ? VisuallyHiddenText : Text

  return (
    <Component
      {...rest}
      {...STYLE_TYPE_MAP.screenTitle}
      as="h1"
      ref={headingRef}
      size={size || STYLE_TYPE_MAP.screenTitle.size}
      className={actualClassName}
    >
      {children}
    </Component>
  )
}
