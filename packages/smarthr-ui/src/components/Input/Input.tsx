'use client'

import {
  type ComponentPropsWithRef,
  type ReactNode,
  type WheelEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { backgroundColor } from '../../themes'

type Props = {
  /** input 要素の `type` 値 */
  type?: HTMLInputElement['type']
  /** フォームにエラーがあるかどうか */
  error?: boolean
  /** コンポーネントの幅 */
  width?: number | string
  /** オートフォーカスを行うかどうか */
  autoFocus?: boolean
  /** コンポーネント内の先頭に表示する内容 */
  prefix?: ReactNode
  /** コンポーネント内の末尾に表示する内容 */
  suffix?: ReactNode
  /** 背景色。readOnly を下地の上に載せる場合に使う */
  bgColor?: keyof typeof bgColors
  /**
   * @deprecated placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
   */
  placeholder?: string
}
type ElementProps = Omit<ComponentPropsWithRef<'input'>, keyof Props>

export const bgColors = {
  BACKGROUND: 'background',
  COLUMN: 'column',
  BASE_GREY: 'base-grey',
  OVER_BACKGROUND: 'over-background',
  HEAD: 'head',
  BORDER: 'border',
  ACTION_BACKGROUND: 'action-background',
} as const

const wrapperClassNameGenerator = tv({
  base: [
    'smarthr-ui-Input',
    'shr-border-shorthand shr-box-border shr-inline-flex shr-cursor-text shr-items-center shr-gap-0.5 shr-rounded-m shr-bg-white shr-px-0.5',
    'contrast-more:shr-border-high-contrast',
    'focus-within:shr-focus-indicator',
    'has-[[aria-invalid]]:shr-border-danger',
  ],
  variants: {
    disabled: {
      true: 'shr-pointer-events-none shr-bg-white-darken [&&&]:shr-border-default/50',
    },
    readOnly: {
      true: '[&&&]:shr-border-[theme(backgroundColor.background)] [&&&]:shr-bg-background',
    },
  },
})
const innerClassNameGenerator = tv({
  slots: {
    input: [
      'smarthr-ui-Input-input',
      'shr-inline-block shr-w-full shr-grow shr-border-none shr-bg-transparent shr-py-0.75 shr-text-base shr-leading-none shr-text-black shr-outline-none shr-outline-0',
      'placeholder:shr-text-grey',
      'disabled:shr-text-disabled disabled:shr-opacity-100',
      'shr-h-[theme(fontSize.base)]',
      // HINT: 日付系inputがsafariなどで対応されていないため、input要素内が空白になりフォームが潰れる場合がある
      // マジックナンバーになるが、ほかに適切なプロパティがないため、min-widthで最低幅を指定することで防ぐ
      '[&[type="datetime-local"]]:shr-min-w-[11em] [&[type="month"]]:shr-min-w-[8em] [&[type="time"]]:shr-min-w-[5em]',
    ],
    affix: 'shr-flex shr-shrink-0 shr-items-center shr-text-grey',
  },
})

export const Input = forwardRef<HTMLInputElement, Props & ElementProps>(
  (
    {
      onFocus,
      onBlur,
      autoFocus,
      prefix,
      suffix,
      className,
      width,
      disabled,
      error,
      readOnly,
      bgColor,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement>(null)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current,
    )

    const handleWheel = useMemo(
      () => (props.type === 'number' ? disableWheel : undefined),
      [props.type],
    )

    const onClickFocus = useCallback(() => innerRef.current?.focus(), [])

    useEffect(() => {
      if (autoFocus && innerRef.current) {
        innerRef.current.focus()
      }
    }, [autoFocus])

    const wrapperClassName = useMemo(
      () => wrapperClassNameGenerator({ disabled, readOnly, className }),
      [disabled, readOnly, className],
    )
    const wrapperStyle = useMemo(() => {
      const color = bgColor
        ? backgroundColor[bgColors[bgColor] as keyof typeof backgroundColor]
        : undefined
      const maxWidth = typeof width === 'number' ? `${width}px` : width

      return {
        borderColor: color,
        backgroundColor: color,
        maxWidth,
        width: maxWidth ? '100%' : undefined,
      }
    }, [width, bgColor])

    const innerClassNames = useMemo(() => {
      const { input, affix } = innerClassNameGenerator()

      return {
        input: input(),
        prefix: affix({ className: 'smarthr-ui-Input-prefix' }),
        suffix: affix({ className: 'smarthr-ui-Input-suffix' }),
      }
    }, [])

    return (
      <span
        role="presentation"
        onClick={onClickFocus}
        className={wrapperClassName}
        style={wrapperStyle}
      >
        {prefix && <span className={innerClassNames.prefix}>{prefix}</span>}
        <input
          {...props}
          data-smarthr-ui-input="true"
          onFocus={onFocus}
          onBlur={onBlur}
          onWheel={handleWheel}
          disabled={disabled}
          readOnly={readOnly}
          ref={innerRef}
          aria-invalid={error || undefined}
          className={innerClassNames.input}
        />
        {suffix && <span className={innerClassNames.suffix}>{suffix}</span>}
      </span>
    )
  },
)

const disableWheel = (e: WheelEvent) => {
  // wheel イベントに preventDefault はないため
  if (e.target) {
    ;(e.target as HTMLInputElement).blur()
  }
}
