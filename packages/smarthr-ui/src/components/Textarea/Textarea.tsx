'use client'

import React, {
  ComponentPropsWithRef,
  forwardRef,
  startTransition,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { debounce } from '../../libs/debounce'
import { lineHeight } from '../../themes'
import { defaultHtmlFontSize } from '../../themes/createFontSize'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

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
  /** 入力可能な最大文字数。あと何文字入力できるかの表示が追加される。html的なvalidateは発生しない */
  maxLetters?: number
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<
    | 'beforeMaxLettersCount'
    | 'afterMaxLettersCount'
    | 'afterMaxLettersCountExceeded'
    | 'beforeScreenReaderMaxLettersDescription'
    | 'afterScreenReaderMaxLettersDescription'
  >
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

const TEXT_BEFORE_MAXLETTERS_COUNT = 'あと'
const TEXT_AFTER_MAXLETTERS_COUNT = '文字'
const TEXT_AFTER_MAXLETTERS_COUNT_EXCEEDED = 'オーバー'

const SCREEN_READER_BEFORE_MAXLETTERS_DESCRIPTION = '最大'
const SCREEN_READER_AFTER_MAXLETTERS_DESCRIPTION = '文字入力できます'

const textarea = tv({
  slots: {
    textareaEl: [
      'smarthr-ui-Textarea-textarea',
      'shr-border-shorthand shr-my-[unset] shr-box-border shr-rounded-m shr-bg-white shr-p-0.5 shr-text-base shr-leading-normal shr-text-black shr-opacity-100',
      'contrast-more:shr-border-high-contrast',
      'placeholder:shr-text-grey',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-pointer-events-none disabled:shr-bg-column disabled:shr-text-disabled disabled:placeholder:shr-text-disabled',
      'aria-[invalid]:shr-border-danger',
    ],
    counter: 'smarthr-ui-Textarea-counter shr-block shr-text-sm',
    counterText: 'shr-text-black',
  },
  variants: {
    error: {
      true: {
        counterText: 'shr-text-danger',
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
      maxLetters,
      width,
      className,
      autoResize = false,
      maxRows = Infinity,
      rows = 2,
      onInput,
      decorators,
      error,
      onChange,
      ...props
    },
    ref,
  ) => {
    const maxLettersId = useId()
    const maxLettersNoticeId = `${maxLettersId}-notice`
    const actualMaxLettersId = maxLetters ? maxLettersId : undefined

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const currentValue = props.defaultValue || props.value
    const [interimRows, setInterimRows] = useState(rows)
    const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
    const [srCounterMessage, setSrCounterMessage] = useState('')

    const {
      afterMaxLettersCount,
      beforeMaxLettersCount,
      maxLettersCountExceeded,
      beforeScreenReaderMaxLettersDescription,
      afterScreenReaderMaxLettersDescription,
    } = useMemo(
      () => ({
        beforeMaxLettersCount:
          decorators?.beforeMaxLettersCount?.(TEXT_BEFORE_MAXLETTERS_COUNT) ||
          TEXT_BEFORE_MAXLETTERS_COUNT,
        afterMaxLettersCount:
          decorators?.afterMaxLettersCount?.(TEXT_AFTER_MAXLETTERS_COUNT) ||
          TEXT_AFTER_MAXLETTERS_COUNT,
        maxLettersCountExceeded:
          decorators?.afterMaxLettersCountExceeded?.(TEXT_AFTER_MAXLETTERS_COUNT_EXCEEDED) ||
          TEXT_AFTER_MAXLETTERS_COUNT_EXCEEDED,
        beforeScreenReaderMaxLettersDescription:
          decorators?.beforeScreenReaderMaxLettersDescription?.(
            SCREEN_READER_BEFORE_MAXLETTERS_DESCRIPTION,
          ) || SCREEN_READER_BEFORE_MAXLETTERS_DESCRIPTION,
        afterScreenReaderMaxLettersDescription:
          decorators?.afterScreenReaderMaxLettersDescription?.(
            SCREEN_READER_AFTER_MAXLETTERS_DESCRIPTION,
          ) || SCREEN_READER_AFTER_MAXLETTERS_DESCRIPTION,
      }),
      [decorators],
    )

    const getCounterMessage = useCallback(
      (counterValue: number) => {
        if (maxLetters === undefined) return

        if (counterValue > maxLetters) {
          // {count}文字オーバー
          return `${counterValue - maxLetters}${afterMaxLettersCount}${maxLettersCountExceeded}`
        }

        // あと{count}文字
        return `${beforeMaxLettersCount}${maxLetters - counterValue}${afterMaxLettersCount}`
      },
      [maxLetters, maxLettersCountExceeded, afterMaxLettersCount, beforeMaxLettersCount],
    )

    const counterVisualMessage = useMemo(() => getCounterMessage(count), [count, getCounterMessage])

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

    useEffect(() => {
      if (autoFocus && textareaRef && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdateCount = useCallback(
      debounce((value: string) => {
        startTransition(() => {
          setCount(getStringLength(value))
        })
      }, 200),
      [],
    )

    // countが連続で更新されると、スクリーンリーダーが古い値を読み上げてしまうため、メッセージの更新を遅延しています
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdateSrCounterMessage = useCallback(
      debounce((value: string) => {
        startTransition(() => {
          const counterText = getCounterMessage(getStringLength(value))

          if (counterText) {
            setSrCounterMessage(counterText)
          }
        })
      }, 1000),
      [getCounterMessage],
    )

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
          onChange(event)
        }

        if (maxLetters) {
          const inputValue = event.currentTarget.value
          debouncedUpdateCount(inputValue)
          debouncedUpdateSrCounterMessage(inputValue)
        }
      },
      [debouncedUpdateCount, maxLetters, onChange, debouncedUpdateSrCounterMessage],
    )

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

        if (onInput) {
          onInput(e)
        }
      },
      [autoResize, maxRows, onInput, rows],
    )
    const { textareaStyleProps, counterStyle, counterTextStyle } = useMemo(() => {
      const { textareaEl, counter, counterText } = textarea()
      return {
        textareaStyleProps: {
          className: textareaEl({ className }),
          style: { width: typeof width === 'number' ? `${width}px` : width },
        },
        counterStyle: counter(),
        counterTextStyle: counterText({ error: !!(maxLetters && maxLetters - count < 0) }),
      }
    }, [className, count, maxLetters, width])

    const hasInputError = useMemo(() => {
      const isCharLengthExceeded = maxLetters && count > maxLetters
      return error || isCharLengthExceeded || undefined
    }, [error, maxLetters, count])

    const body = (
      <textarea
        {...props}
        {...textareaStyleProps}
        {...(maxLetters && { 'aria-describedby': `${maxLettersNoticeId} ${actualMaxLettersId}` })}
        data-smarthr-ui-input="true"
        onChange={handleChange}
        ref={textareaRef}
        aria-invalid={hasInputError || undefined}
        rows={interimRows}
        onInput={handleInput}
      />
    )

    return maxLetters ? (
      <span>
        {body}
        <span className={counterStyle}>
          <span className={counterTextStyle} id={actualMaxLettersId} aria-hidden={true}>
            {counterVisualMessage}
          </span>
        </span>
        <VisuallyHiddenText aria-live="polite">{srCounterMessage}</VisuallyHiddenText>
        <VisuallyHiddenText id={maxLettersNoticeId}>
          {beforeScreenReaderMaxLettersDescription}
          {maxLetters}
          {afterScreenReaderMaxLettersDescription}
        </VisuallyHiddenText>
      </span>
    ) : (
      body
    )
  },
)
