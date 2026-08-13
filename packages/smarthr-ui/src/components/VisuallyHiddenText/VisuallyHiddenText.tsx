import {
  type ComponentProps,
  type ElementType,
  type FC,
  type PropsWithChildren,
  type Ref,
  forwardRef,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import type { ElementRef } from '../../types'

const visuallyHiddenTextClassNameGenerator = tv({
  base: 'shr-absolute shr-h-px shr-w-px shr-overflow-hidden shr-whitespace-nowrap shr-border-0 shr-p-0 [clip-path:inset(100%)] [clip:rect(0_0_0_0)]',
})

export const visuallyHiddenTextClassName = visuallyHiddenTextClassNameGenerator()

// HINT: ComponentProps<T> が ref を含むため、TextLink などのように ElementRefProps<T> は付与しない
type Props<T extends ElementType> = PropsWithChildren<{
  as?: T
}> &
  ComponentProps<T>

type VisuallyHiddenTextComponent = <T extends ElementType = 'span'>(
  props: Props<T>,
) => ReturnType<FC>

const ActualVisuallyHiddenText: VisuallyHiddenTextComponent = forwardRef(
  <T extends ElementType = 'span'>(
    { as: Component = 'span', className, ...rest }: Props<T>,
    ref: Ref<ElementRef<T>>,
  ) => {
    const actualClassName = useMemo(
      () => visuallyHiddenTextClassNameGenerator({ className }),
      [className],
    )

    return (
      <Component
        {...rest}
        ref={ref}
        className={`smarthr-ui-VisuallyHiddenText ${actualClassName}`}
      />
    )
  },
)

export const VisuallyHiddenText = memo(ActualVisuallyHiddenText) as typeof ActualVisuallyHiddenText
