'use client'

import React, {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Tooltip } from '../Tooltip'

type Props = PropsWithChildren<VariantProps<typeof lineClamp>>
type ElementProps = Omit<ComponentPropsWithRef<'span'>, keyof Props>

const lineClamp = tv({
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
  const [isTooltipVisible, setTooltipVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)

  const isMultiLineOverflow = () => {
    const el = ref.current
    const shadowEl = shadowRef.current

    // -webkit-line-clamp を使った要素ではel.scrollHeightとel.clientHeightの比較だと
    // フォントの高さの計算が期待と異なり適切な高さが取得できないためshadowElと比較している
    // 参考: https://github.com/kufu/smarthr-ui/pull/4710
    return el && shadowEl
      ? shadowEl.clientWidth > el.clientWidth || shadowEl.clientHeight > el.clientHeight
      : false
  }

  useEffect(() => {
    setTooltipVisible(isMultiLineOverflow())
  }, [maxLines, children])

  if (maxLines < 1) {
    throw new Error('"maxLines" cannot be less than 0.')
  }

  const { baseStyle, clampedLineStyle, shadowElementWrapperStyle, shadowElementStyle } =
    useMemo(() => {
      const { base, clampedLine, shadowElementWrapper, shadowElement } = lineClamp({ maxLines })
      return {
        baseStyle: base({ className }),
        clampedLineStyle: clampedLine(),
        shadowElementWrapperStyle: shadowElementWrapper(),
        shadowElementStyle: shadowElement(),
      }
    }, [maxLines, className])

  const ActualLineClamp = () => (
    <span {...props} className={baseStyle}>
      <span className={clampedLineStyle} ref={ref}>
        {children}
      </span>
      {/* 切り取られていないテキストの高さを取得するための要素 */}
      <span aria-hidden className={shadowElementWrapperStyle}>
        <span className={shadowElementStyle} ref={shadowRef}>
          {children}
        </span>
      </span>
    </span>
  )

  return isTooltipVisible ? (
    <Tooltip message={children} multiLine vertical="auto">
      <ActualLineClamp />
    </Tooltip>
  ) : (
    <ActualLineClamp />
  )
}
