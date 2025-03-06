'use client'

import React, {
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Tooltip } from '../Tooltip'

type Props = PropsWithChildren<VariantProps<typeof classNameGenerator>>
type ElementProps = Omit<ComponentPropsWithRef<'span'>, keyof Props>

const classNameGenerator = tv({
  slots: {
    base: 'smarthr-ui-LineClamp shr-relative',
    clampedLine: 'shr-w-full',
    shadowElementWrapper:
      'shr-absolute shr-overflow-hidden shr-w-full shr-h-full shr-opacity-0 shr-invisible shr-left-0 shr-top-0 shr-whitespace-normal',
    shadowElement: 'shr-absolute shr-w-full shr-top-0 shr-left-0',
  },
  variants: {
    maxLines: {
      1: {
        clampedLine:
          'shr-inline-block shr-w-full shr-overflow-hidden shr-overflow-ellipsis shr-whitespace-nowrap shr-align-middle',
      },
      2: {
        clampedLine: 'shr-line-clamp-[2]',
      },
      3: {
        clampedLine: 'shr-line-clamp-[3]',
      },
      4: {
        clampedLine: 'shr-line-clamp-[4]',
      },
      5: {
        clampedLine: 'shr-line-clamp-[5]',
      },
      6: {
        clampedLine: 'shr-line-clamp-[6]',
      },
    },
  },
  compoundVariants: [
    {
      maxLines: [2, 3, 4, 5, 6],
      className: {
        // baseがdisplay:-webkit-boxでないと高さ取得用の要素が表示部分と同じ大きさで表示されないバグを回避するため
        base: '[display:-webkit-box]',
      },
    },
  ],
})

export const LineClamp: FC<Props & ElementProps> = ({
  maxLines = 3,
  children,
  className,
  ...props
}) => {
  if (maxLines < 1 || maxLines > 6) {
    throw new Error('"maxLines" は 1 ~ 6 の範囲で指定してください')
  }

  const [isTooltipVisible, setTooltipVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const shadowEl = shadowRef.current

    // -webkit-line-clamp を使った要素ではel.scrollHeightとel.clientHeightの比較だと
    // フォントの高さの計算が期待と異なり適切な高さが取得できないためshadowElと比較している
    // 参考: https://github.com/kufu/smarthr-ui/pull/4710
    const isMultiLineOverflow =
      el && shadowEl
        ? shadowEl.clientWidth > el.clientWidth || shadowEl.clientHeight > el.clientHeight
        : false

    setTooltipVisible(isMultiLineOverflow)
  }, [maxLines, children])

  const classNames = useMemo(() => {
    const { base, clampedLine, shadowElementWrapper, shadowElement } = classNameGenerator({
      maxLines,
    })

    return {
      base: base({ className }),
      clampedLine: clampedLine(),
      shadowElementWrapper: shadowElementWrapper(),
      shadowElement: shadowElement(),
    }
  }, [maxLines, className])

  const actualLineClamp = (
    <span {...props} className={classNames.base}>
      <span ref={ref} className={classNames.clampedLine}>
        {children}
      </span>
      {/* 切り取られていないテキストの高さを取得するための要素 */}
      <span aria-hidden className={classNames.shadowElementWrapper}>
        <span className={classNames.shadowElement} ref={shadowRef}>
          {children}
        </span>
      </span>
    </span>
  )

  return isTooltipVisible ? (
    <Tooltip message={children} multiLine vertical="auto">
      {actualLineClamp}
    </Tooltip>
  ) : (
    actualLineClamp
  )
}
