import { type ComponentProps, type ElementType, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export const visuallyHiddenTextClassNameGenerator = tv({
  base: 'shr-absolute shr-h-px shr-w-px shr-overflow-hidden shr-whitespace-nowrap shr-border-0 shr-p-0 [clip-path:inset(100%)] [clip:rect(0_0_0_0)]',
})

type Props<T extends ElementType> = PropsWithChildren<{
  as?: T
}> &
  ComponentProps<T>

const ActualVisuallyHiddenText = <T extends ElementType = 'span'>({
  as: Component = 'span',
  className,
  ...props
}: Props<T>) => {
  const actualClassName = useMemo(
    () => visuallyHiddenTextClassNameGenerator({ className }),
    [className],
  )

  return <Component {...props} className={`smarthr-ui-VisuallyHiddenText ${actualClassName}`} />
}

export const VisuallyHiddenText = memo(ActualVisuallyHiddenText) as typeof ActualVisuallyHiddenText
