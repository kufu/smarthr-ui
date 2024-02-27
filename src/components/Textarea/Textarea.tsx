import React, {
  ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTailwindTheme'
import { defaultHtmlFontSize } from '../../themes/createFontSize'

import type { DecoratorsType } from '../../types'

type Props = {
  /** 入力値にエラーがあるかどうか */
  error?: boolean
  /** コンポーネントの幅 */
  width?: number | string
  /** 自動でフォーカスされるかどうか */
  autoFocus?: boolean
  /** 自動で広がるかどうか */
  autoResize?: boolean
  /** 最大行数。超えるとスクロールする。初期値は無限 */
  maxRows?: number
  /** 行数の初期値。省略した場合は2 */
  rows?: number
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'beforeMaxLengthCount' | 'afterMaxLengthCount'>
  /**
   * @deprecated placeholder属性は非推奨です。別途ヒント用要素の設置を検討してください。
   */
  placeholder?: string
}
type ElementProps = Omit<ComponentPropsWithRef<'textarea'>, keyof Props>

const getStringLength = (value: string | number | readonly string[]) => {
  const formattedValue =
    typeof value === 'number' || typeof value === 'string'
      ? `${value}`
      : Array.isArray(value)
        ? value.join(',')
        : ''

  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
  const surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  return formattedValue.length - (formattedValue.match(surrogatePairs) || []).length
}

const TEXT_BEFORE_MAXlENGTH_COUNT = 'あと'
const TEXT_AFTER_MAXlENGTH_COUNT = '文字'

const textarea = tv({
  slots: {
    textareaEl: [
      'smarthr-ui-Textarea-textarea shr-border-shorthand shr-box-border shr-rounded-m shr-bg-white shr-p-0.5 shr-text-base shr-leading-normal shr-text-black shr-opacity-100',
      'contrast-more:shr-border-high-contrast',
      'placeholder:shr-text-grey',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-pointer-events-none disabled:shr-bg-column disabled:shr-text-disabled disabled:placeholder:shr-text-disabled',
    ],
    counter: 'smarthr-ui-Textarea-counter shr-block shr-text-sm',
    counterText: 'shr-font-bold',
  },
  variants: {
    error: {
      true: {
        textareaEl: 'shr-border-danger',
        counterText: 'shr-text-danger',
      },
      false: {
        textareaEl: 'shr-border-default',
        counterText: 'shr-text-grey',
      },
    },
  },
  defaultVariants: {
    error: false,
  },
})

export const Textarea = forwardRef<HTMLTextAreaElement, Props & ElementProps>(
  (
    {
      autoFocus,
      maxLength,
      width,
      className,
      autoResize = false,
      maxRows = Infinity,
      rows = 2,
      onInput,
      decorators,
      error,
      ...props
    },
    ref,
  ) => {
    const { lineHeight } = useTheme()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const currentValue = props.defaultValue || props.value
    const [interimRows, setInterimRows] = useState(rows)
    const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
    const beforeMaxLengthCount = useMemo(
      () =>
        decorators?.beforeMaxLengthCount?.(TEXT_BEFORE_MAXlENGTH_COUNT) ||
        TEXT_BEFORE_MAXlENGTH_COUNT,
      [decorators],
    )
    const afterMaxLengthCount = useMemo(
      () =>
        decorators?.afterMaxLengthCount?.(TEXT_AFTER_MAXlENGTH_COUNT) || TEXT_AFTER_MAXlENGTH_COUNT,
      [decorators],
    )

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

    useEffect(() => {
      if (autoFocus && textareaRef && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    const handleKeyup = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      setCount(getStringLength(event.currentTarget.value))
    }, [])
    const handleInput = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!autoResize) {
          return onInput && onInput(e)
        }

        const previousRows = e.target.rows
        // 消したことを検知できないので必ず初期化
        e.target.rows = rows

        const currentRows = Math.floor(
          e.target.scrollHeight / (defaultHtmlFontSize * Number(lineHeight.normal)),
        )

        if (previousRows === currentRows) {
          e.target.rows = currentRows
        } else if (maxRows < currentRows) {
          // 最大まで達したとき高さが潰れないように代入
          e.target.rows = maxRows
        }

        setInterimRows(currentRows < maxRows ? currentRows : maxRows)
        onInput && onInput(e)
      },
      [autoResize, lineHeight.normal, maxRows, onInput, rows],
    )
    const { textareaStyleProps, counterStyle, counterTextStyle } = useMemo(() => {
      const { textareaEl, counter, counterText } = textarea()
      return {
        textareaStyleProps: {
          className: textareaEl({ error, className }),
          style: { width: typeof width === 'number' ? `${width}px` : width },
        },
        counterStyle: counter(),
        counterTextStyle: counterText({ error: !!(maxLength && maxLength - count <= 0) }),
      }
    }, [className, count, error, maxLength, width])

    return (
      <>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <textarea
          {...props}
          {...textareaStyleProps}
          {...(maxLength ? { onKeyUp: handleKeyup } : {})}
          ref={textareaRef}
          aria-invalid={error || undefined}
          rows={interimRows}
          onInput={handleInput}
        />
        {maxLength && (
          <span className={counterStyle}>
            {beforeMaxLengthCount}
            <span className={counterTextStyle}>{maxLength - count}</span>
            {afterMaxLengthCount}
          </span>
        )}
      </>
    )
  },
)
