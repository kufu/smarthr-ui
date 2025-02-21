import React, { type ComponentProps, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export const visuallyHiddenTextClassNameGenerator = tv({
  base: 'shr-absolute -shr-top-px shr-left-0 shr-h-px shr-w-px shr-overflow-hidden shr-whitespace-nowrap shr-border-0 shr-p-0 [clip-path:inset(100%)] [clip:rect(0_0_0_0)]',
})

type Props<T extends React.ElementType> = PropsWithChildren<{
  as?: T
}> &
  ComponentProps<T>

const ActualVisuallyHiddenText = <T extends React.ElementType = 'span'>({
  as: Component = 'span',
  className,
  ...props
}: Props<T>) => {
  const styles = useMemo(() => visuallyHiddenTextClassNameGenerator({ className }), [className])

  return <Component {...props} className={styles} />
}

export const VisuallyHiddenText = memo(ActualVisuallyHiddenText) as typeof ActualVisuallyHiddenText
