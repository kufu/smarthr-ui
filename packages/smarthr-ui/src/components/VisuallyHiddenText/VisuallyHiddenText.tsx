import { type ElementType, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { SHRComponentPropsWithRef } from '../../types'

const visuallyHiddenTextClassNameGenerator = tv({
  base: 'shr-absolute shr-h-px shr-w-px shr-overflow-hidden shr-whitespace-nowrap shr-border-0 shr-p-0 [clip-path:inset(100%)] [clip:rect(0_0_0_0)]',
})

export const visuallyHiddenTextClassName = visuallyHiddenTextClassNameGenerator()

type Props<T extends ElementType> = SHRComponentPropsWithRef<T, { as?: T }>

const ActualVisuallyHiddenText = <T extends ElementType = 'span'>({
  as,
  className,
  ...rest
}: Props<T>) => {
  const Component = as || 'span'
  const actualClassName = useMemo(
    // HINT: smarthr-ui-VisuallyHiddenTextは明示的にこのコンポーネントを利用している場合にのみ設定します
    // visuallyHiddenTextClassName を利用している場合、他のclassに混ぜられたりする関係上、要素として検索する際
    // ノイズになる可能性があるため
    () =>
      visuallyHiddenTextClassNameGenerator({
        className: `smarthr-ui-VisuallyHiddenText ${className || ''}`,
      }),
    [className],
  )

  return <Component {...rest} className={actualClassName} />
}

export const VisuallyHiddenText = memo(ActualVisuallyHiddenText) as typeof ActualVisuallyHiddenText
