import {
  type ComponentPropsWithRef,
  type ElementType,
  type FC,
  type PropsWithChildren,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

const visuallyHiddenTextClassNameGenerator = tv({
  base: 'shr-absolute shr-h-px shr-w-px shr-overflow-hidden shr-whitespace-nowrap shr-border-0 shr-p-0 [clip-path:inset(100%)] [clip:rect(0_0_0_0)]',
})

export const visuallyHiddenTextClassName = visuallyHiddenTextClassNameGenerator()

// HINT: ComponentPropsWithRef<T> が ref を含むため、別途 ref の型を合成する必要はない
type Props<T extends ElementType> = PropsWithChildren<{
  as?: T
}> &
  ComponentPropsWithRef<T>

type VisuallyHiddenTextComponent = <T extends ElementType = 'span'>(
  props: Props<T>,
) => ReturnType<FC>

const ActualVisuallyHiddenText: VisuallyHiddenTextComponent = <T extends ElementType = 'span'>({
  as: Component = 'span',
  className,
  ...rest
}: Props<T>) => {
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
