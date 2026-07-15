'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactNode,
  forwardRef,
  memo,
  startTransition,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
import { useTheme } from '../../hooks/useTheme'
import { Localizer } from '../../intl'
import { debounce } from '../../libs/debounce'
import { defaultHtmlFontSize } from '../../themes'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type AbstractProps = {
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
  /**
   * placeholder属性は非推奨です。別途ヒント用要素の設置を検討してください。
   */
  placeholder?: string
}
type Props = AbstractProps & Omit<ComponentPropsWithRef<'textarea'>, keyof AbstractProps>
type TextareaValue = string | number | readonly string[]

const getStringLength = (value: TextareaValue) => {
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

const classNameGenerator = tv({
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
    counter: [
      'smarthr-ui-Textarea-counter',
      'shr-block shr-text-sm shr-text-black',
      'data-[error=true]:shr-text-danger',
    ],
  },
})

const calculateIdealRows = (
  element: HTMLTextAreaElement | null | undefined,
  maxRows: number,
  lineHeightNormal: number,
): number => {
  if (!element) {
    return 0
  }

  // 現在の入力値に応じた行数
  const currentInputValueRows = Math.floor(
    element.scrollHeight / (defaultHtmlFontSize * lineHeightNormal),
  )

  return currentInputValueRows < maxRows ? currentInputValueRows : maxRows
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      autoFocus,
      maxLetters,
      width,
      className,
      autoResize = false,
      maxRows = Infinity,
      rows = 2,
      error,
      onChange,
      value,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme()
    const maxLettersId = useId()
    const maxLettersNoticeId = `${maxLettersId}-notice`
    const actualMaxLettersId = maxLetters ? maxLettersId : undefined

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const currentValue = defaultValue || value
    const [interimRows, setInterimRows] = useState(rows)
    const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
    const [srCounterMessage, setSrCounterMessage] = useState<ReactNode>('')

    const latest = useLatest({
      onChange,
      maxLetters,
      rows,
      autoResize,
      maxRows,
      themeLeadingNormal: theme.leading.NORMAL,
    })

    const functions = useMemo(() => {
      const calculateRows = (element: HTMLTextAreaElement | null | undefined) =>
        calculateIdealRows(element, latest.maxRows, latest.themeLeadingNormal)

      const getCounterMessage = (counterValue: number) => {
        if (latest.maxLetters === undefined) return

        if (counterValue > latest.maxLetters) {
          // {count}文字オーバー
          return (
            <Localizer
              id="smarthr-ui/Textarea/maxLettersExceeded"
              defaultText="{exceededLetters}文字オーバー"
              values={{ exceededLetters: counterValue - latest.maxLetters }}
            />
          )
        }

        // あと{count}文字
        return (
          <Localizer
            id="smarthr-ui/Textarea/availableLetters"
            defaultText="あと{availableLetters}文字"
            values={{ availableLetters: latest.maxLetters - counterValue }}
          />
        )
      }

      const updateCounters = !latest.maxLetters
        ? undefined
        : (() => {
            const updateCount = debounce((newValue: TextareaValue) => {
              startTransition(() => {
                setCount(getStringLength(newValue))
              })
            }, 200)

            // countが連続で更新されると、スクリーンリーダーが古い値を読み上げてしまうため、メッセージの更新を遅延しています
            const updateSrMessage = debounce((newValue: TextareaValue) => {
              startTransition(() => {
                const counterText = getCounterMessage(getStringLength(newValue))

                if (counterText) {
                  setSrCounterMessage(counterText)
                }
              })
            }, 1000)

            return (newValue: TextareaValue) => {
              updateCount(newValue)
              updateSrMessage(newValue)
            }
          })()

      return {
        calculateRows,
        getCounterMessage,
        updateCounters,
        handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          const newValue = e.target.value
          updateCounters?.(newValue)

          // rowsを初期化 TextareaのscrollHeightが文字列削除時に変更されないため
          e.target.rows = latest.rows

          if (latest.autoResize) {
            const currentRows = calculateRows(e.target)
            // rowsを直接反映 Textareaのrows propsが状態を変更しても反映されないため
            e.target.rows = currentRows
            setInterimRows(currentRows)
          }

          latest.onChange?.(e)
        },
      }
    }, [latest])

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

    // autoFocus時に、フォーカスを当てる
    useEffect(() => {
      if (autoFocus && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    // autoResize時に、初期値での高さを指定
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        setInterimRows(functions.calculateRows(textareaRef.current))
      }
    }, [autoResize, functions])

    // value 変更時にもカウントを更新する
    useEffect(() => {
      if (value && maxLetters) {
        functions.updateCounters?.(value)
      }
    }, [value, maxLetters, functions])

    const textareaStyle = useMemo(
      () => ({ width: typeof width === 'number' ? `${width}px` : width }),
      [width],
    )
    const countError = maxLetters && count > maxLetters
    const classNames = useMemo(() => {
      const { textareaEl, counter } = classNameGenerator()

      return {
        textarea: textareaEl({ className }),
        counter: counter(),
      }
    }, [className])

    const body = (
      <textarea
        {...rest}
        data-smarthr-ui-input="true"
        value={value}
        defaultValue={defaultValue}
        onChange={functions.handleChange}
        ref={textareaRef}
        aria-describedby={maxLetters ? `${maxLettersNoticeId} ${actualMaxLettersId}` : undefined}
        aria-invalid={error || countError || undefined}
        rows={interimRows}
        className={classNames.textarea}
        style={textareaStyle}
      />
    )

    return maxLetters ? (
      <span className="shr-relative">
        {body}
        <MaxLettersNotice id={maxLettersNoticeId} maxLetters={maxLetters} />
        <VisuallyHiddenText aria-live="polite">{srCounterMessage}</VisuallyHiddenText>
        <span
          id={actualMaxLettersId}
          aria-hidden={true}
          className={classNames.counter}
          data-error={countError || undefined}
        >
          {functions.getCounterMessage(count)}
        </span>
      </span>
    ) : (
      body
    )
  },
)

const MaxLettersNotice = memo<{ id: string; maxLetters: number }>(({ id, maxLetters }) => (
  <VisuallyHiddenText id={id}>
    <Localizer
      id="smarthr-ui/Textarea/screenReaderMaxLettersDescription"
      defaultText="最大{maxLetters}文字入力できます"
      values={{ maxLetters }}
    />
  </VisuallyHiddenText>
))
