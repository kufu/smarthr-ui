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

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ maxLetters, ...rest }, ref) =>
  maxLetters ? (
    <MaxLettersTextarea {...rest} maxLetters={maxLetters} ref={ref} />
  ) : (
    <ActualTextarea {...rest} ref={ref} />
  ),
)

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
    counter: 'smarthr-ui-Textarea-counter shr-block shr-text-sm shr-text-black',
  },
  variants: {
    error: {
      true: {
        counter: 'shr-text-danger',
      },
    },
  },
  defaultVariants: {
    error: false,
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

const ActualTextarea = forwardRef<
  HTMLTextAreaElement,
  Omit<Props, 'maxLetters'> & {
    'aria-describedby'?: string
    countError?: boolean
  }
>(
  (
    {
      autoFocus,
      width,
      className,
      autoResize = false,
      maxRows = Infinity,
      rows = 2,
      error,
      onChange,
      value,
      defaultValue,
      'aria-describedby': ariaDescribedby,
      countError,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme()
    const internalRef = useRef<HTMLTextAreaElement | null>(null)
    const [interimRows, setInterimRows] = useState(rows)

    const textareaStyle = useMemo(
      () => ({ width: typeof width === 'number' ? `${width}px` : width }),
      [width],
    )
    const classNames = useMemo(() => {
      const { textareaEl } = classNameGenerator()

      return {
        textarea: textareaEl({ className }),
      }
    }, [className])

    const latest = useLatest({
      onChange,
      ref,
      autoFocus,
      autoResize,
      maxRows,
      rows,
      theme,
    })

    const functions = useMemo(
      () => ({
        textareaRef: (node: HTMLTextAreaElement | null) => {
          internalRef.current = node

          // 外部refの設定
          if (typeof latest.ref === 'function') {
            latest.ref(node)
          } else if (latest.ref) {
            // RefObject.currentは型定義上readonlyだが、実行時は書き込み可能
            Object.assign(latest.ref, { current: node })
          }

          if (node) {
            // autoFocus時に、フォーカスを当てる
            if (latest.autoFocus) {
              node.focus()
            }
            // autoResize時に、初期値での高さを指定
            if (latest.autoResize) {
              setInterimRows(calculateIdealRows(node, latest.maxRows, latest.theme.leading.NORMAL))
            }
          }
        },
        handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          // rowsを初期化 TextareaのscrollHeightが文字列削除時に変更されないため
          e.target.rows = latest.rows

          if (latest.autoResize) {
            const currentRows = calculateIdealRows(
              e.target,
              latest.maxRows,
              latest.theme.leading.NORMAL,
            )
            // rowsを直接反映 Textareaのrows propsが状態を変更しても反映されないため
            e.target.rows = currentRows
            setInterimRows(currentRows)
          }

          latest.onChange?.(e)
        },
      }),
      [latest],
    )

    return (
      <textarea
        {...rest}
        data-smarthr-ui-input="true"
        value={value}
        defaultValue={defaultValue}
        onChange={functions.handleChange}
        ref={functions.textareaRef}
        aria-describedby={ariaDescribedby}
        aria-invalid={error || countError || undefined}
        rows={interimRows}
        className={classNames.textarea}
        style={textareaStyle}
      />
    )
  },
)

const MaxLettersTextarea = forwardRef<HTMLTextAreaElement, Props & { maxLetters: number }>(
  ({ maxLetters, onChange, value, defaultValue, error, className, ...rest }, ref) => {
    const maxLettersId = useId()
    const maxLettersNoticeId = `${maxLettersId}-notice`

    const currentValue = defaultValue || value
    const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
    const [srCounterMessage, setSrCounterMessage] = useState<ReactNode>('')

    const latest = useLatest({ onChange })

    const functions = useMemo(() => {
      const getCounterMessage = (counterValue: number) => {
        if (counterValue > maxLetters) {
          // {count}文字オーバー
          return (
            <Localizer
              id="smarthr-ui/Textarea/maxLettersExceeded"
              defaultText="{exceededLetters}文字オーバー"
              values={{ exceededLetters: counterValue - maxLetters }}
            />
          )
        }

        // あと{count}文字
        return (
          <Localizer
            id="smarthr-ui/Textarea/availableLetters"
            defaultText="あと{availableLetters}文字"
            values={{ availableLetters: maxLetters - counterValue }}
          />
        )
      }

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

      const updateCounters = (newValue: TextareaValue) => {
        updateCount(newValue)
        updateSrMessage(newValue)
      }

      return {
        getCounterMessage,
        updateCounters,
        handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          updateCounters(e.target.value)
          latest.onChange?.(e)
        },
      }
    }, [maxLetters, latest])

    const counterVisualMessage = useMemo(
      () => functions.getCounterMessage(count),
      [count, functions],
    )

    // value 変更時にもカウントを更新する
    useEffect(() => {
      if (value) {
        functions.updateCounters(value)
      }
    }, [value, functions])

    const countError = count > maxLetters
    const classNames = useMemo(() => {
      const { counter } = classNameGenerator()

      return {
        counter: counter({ error: !!countError }),
      }
    }, [countError])

    return (
      <span className="shr-relative">
        <ActualTextarea
          {...rest}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={functions.handleChange}
          error={error}
          className={className}
          aria-describedby={`${maxLettersNoticeId} ${maxLettersId}`}
          countError={countError}
        />
        <MaxLettersNotice id={maxLettersNoticeId} maxLetters={maxLetters} />
        <VisuallyHiddenText aria-live="polite">{srCounterMessage}</VisuallyHiddenText>
        <span id={maxLettersId} aria-hidden={true} className={classNames.counter}>
          {counterVisualMessage}
        </span>
      </span>
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
