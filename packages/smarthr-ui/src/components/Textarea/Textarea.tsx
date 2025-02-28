'use client'

import React, {
  ChangeEvent,
  ComponentPropsWithRef,
  ReactNode,
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

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { debounce } from '../../libs/debounce'
import { lineHeight } from '../../themes'
import { defaultHtmlFontSize } from '../../themes/createFontSize'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

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
  decorators?: DecoratorsType<DecoratorKeyTypes>
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

const DECORATOR_DEFAULT_TEXTS = {
  beforeMaxLettersCount: 'あと',
  afterMaxLettersCount: '文字',
  afterMaxLettersCountExceeded: 'オーバー',
  beforeScreenReaderMaxLettersDescription: '最大',
  afterScreenReaderMaxLettersDescription: '文字入力できます',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

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

const calculateIdealRows = (
  element?: HTMLTextAreaElement | null,
  maxRows: number = Number.MAX_SAFE_INTEGER,
): number => {
  if (!element) {
    return 0
  }

  // 現在の入力値に応じた行数
  const currentInputValueRows = Math.floor(
    element.scrollHeight / (defaultHtmlFontSize * Number(lineHeight.normal)),
  )

  return currentInputValueRows < maxRows ? currentInputValueRows : maxRows
}

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
    const [srCounterMessage, setSrCounterMessage] = useState<ReactNode>('')

    const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)

    const getCounterMessage = useCallback(
      (counterValue: number) => {
        if (maxLetters === undefined) return

        if (counterValue > maxLetters) {
          // {count}文字オーバー
          return (
            <>
              {counterValue - maxLetters}
              {decorated.afterMaxLettersCount}
              {decorated.afterMaxLettersCountExceeded}
            </>
          )
        }

        // あと{count}文字
        return (
          <>
            {decorated.beforeMaxLettersCount}
            {maxLetters - counterValue}
            {decorated.afterMaxLettersCount}
          </>
        )
      },
      [
        maxLetters,
        decorated.afterMaxLettersCountExceeded,
        decorated.afterMaxLettersCount,
        decorated.beforeMaxLettersCount,
      ],
    )

    const counterVisualMessage = useMemo(() => getCounterMessage(count), [count, getCounterMessage])

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

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
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (maxLetters) {
          const inputValue = e.currentTarget.value
          debouncedUpdateCount(inputValue)
          debouncedUpdateSrCounterMessage(inputValue)
        }

        onChange?.(e)
      },
      [debouncedUpdateCount, maxLetters, onChange, debouncedUpdateSrCounterMessage],
    )

    // autoFocus時に、フォーカスを当てる
    useEffect(() => {
      if (autoFocus && textareaRef && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    // autoResize時に、初期値での高さを指定
    useEffect(() => {
      if (!autoResize) {
        return
      }
      if (!textareaRef.current) {
        return
      }

      setInterimRows(calculateIdealRows(textareaRef.current, maxRows))
    }, [setInterimRows, maxRows, autoResize])

    const handleInput = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        // rowsを初期化 TextareaのscrollHeightが文字列削除時に変更されないため
        e.target.rows = rows

        if (autoResize) {
          const currentRows = calculateIdealRows(e.target, maxRows)
          // rowsを直接反映 Textareaのrows propsが状態を変更しても反映されないため
          e.target.rows = currentRows
          setInterimRows(currentRows)
        }

        onInput?.(e)
      },
      [autoResize, maxRows, onInput, rows],
    )

    const textareaStyle = useMemo(
      () => ({ width: typeof width === 'number' ? `${width}px` : width }),
      [width],
    )
    const countError = maxLetters && count > maxLetters
    const classNames = useMemo(() => {
      const { textareaEl, counter, counterText } = textarea()

      return {
        textarea: textareaEl({ className }),
        counter: counter(),
        counterText: counterText({ error: !!countError }),
      }
    }, [countError, className])

    const body = (
      <textarea
        {...props}
        {...(maxLetters && { 'aria-describedby': `${maxLettersNoticeId} ${actualMaxLettersId}` })}
        data-smarthr-ui-input="true"
        onChange={handleChange}
        ref={textareaRef}
        aria-invalid={error || countError || undefined}
        rows={interimRows}
        onInput={handleInput}
        className={classNames.textarea}
        style={textareaStyle}
      />
    )

    return maxLetters ? (
      <span>
        {body}
        <span className={classNames.counter}>
          <span className={classNames.counterText} id={actualMaxLettersId} aria-hidden={true}>
            {counterVisualMessage}
          </span>
        </span>
        <VisuallyHiddenText aria-live="polite">{srCounterMessage}</VisuallyHiddenText>
        <VisuallyHiddenText id={maxLettersNoticeId}>
          {decorated.beforeScreenReaderMaxLettersDescription}
          {maxLetters}
          {decorated.afterScreenReaderMaxLettersDescription}
        </VisuallyHiddenText>
      </span>
    ) : (
      body
    )
  },
)
