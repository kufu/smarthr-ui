'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactNode,
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

import { Localizer } from '../../intl'
import { debounce } from '../../libs/debounce'
import { lineHeight } from '../../themes'
import { defaultHtmlFontSize } from '../../themes/createFontSize'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { DecoratorsType } from '../../hooks/useDecorators'

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
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<DecoratorKeyTypes>
  /**
   * @deprecated placeholder属性は非推奨です。別途ヒント用要素の設置を検討してください。
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

const DECORATOR_DEFAULT_TEXTS = {
  beforeMaxLettersCount: 'あと',
  afterMaxLettersCount: '文字',
  afterMaxLettersCountExceeded: 'オーバー',
  beforeScreenReaderMaxLettersDescription: '最大',
  afterScreenReaderMaxLettersDescription: '文字入力できます',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

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
      decorators,
      error,
      onChange,
      value,
      ...rest
    },
    ref,
  ) => {
    const maxLettersId = useId()
    const maxLettersNoticeId = `${maxLettersId}-notice`
    const actualMaxLettersId = maxLetters ? maxLettersId : undefined

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const currentValue = rest.defaultValue || value
    const [interimRows, setInterimRows] = useState(rows)
    const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
    const [srCounterMessage, setSrCounterMessage] = useState<ReactNode>('')

    const buildAvailableLetters = useCallback(
      (availableLetters: number): ReactNode => {
        if (decorators?.beforeMaxLettersCount || decorators?.afterMaxLettersCount) {
          return (
            <>
              {decorators.beforeMaxLettersCount?.(DECORATOR_DEFAULT_TEXTS.beforeMaxLettersCount)}
              {availableLetters}
              {decorators.afterMaxLettersCount?.(DECORATOR_DEFAULT_TEXTS.afterMaxLettersCount)}
            </>
          )
        }
        return (
          <Localizer
            id="smarthr-ui/Textarea/availableLetters"
            defaultText="あと{availableLetters}文字"
            values={{ availableLetters }}
          />
        )
      },
      [decorators],
    )

    const buildmaxLettersExceeded = useCallback(
      (exceededLetters: number): ReactNode => {
        if (decorators?.afterMaxLettersCount || decorators?.afterMaxLettersCountExceeded) {
          return (
            <>
              {exceededLetters}
              {decorators.afterMaxLettersCount?.(DECORATOR_DEFAULT_TEXTS.afterMaxLettersCount)}
              {decorators.afterMaxLettersCountExceeded?.(
                DECORATOR_DEFAULT_TEXTS.afterMaxLettersCountExceeded,
              )}
            </>
          )
        }
        return (
          <Localizer
            id="smarthr-ui/Textarea/maxLettersExceeded"
            defaultText="{exceededLetters}文字オーバー"
            values={{ exceededLetters }}
          />
        )
      },
      [decorators],
    )

    const buildScreenReaderMaxLettersDescription = useCallback(
      (internalMaxLetters: number): ReactNode => {
        if (
          decorators?.beforeScreenReaderMaxLettersDescription ||
          decorators?.afterScreenReaderMaxLettersDescription
        ) {
          return (
            <>
              {decorators.beforeScreenReaderMaxLettersDescription?.(
                DECORATOR_DEFAULT_TEXTS.beforeScreenReaderMaxLettersDescription,
              )}
              {internalMaxLetters}
              {decorators.afterScreenReaderMaxLettersDescription?.(
                DECORATOR_DEFAULT_TEXTS.afterScreenReaderMaxLettersDescription,
              )}
            </>
          )
        }
        return (
          <Localizer
            id="smarthr-ui/Textarea/screenReaderMaxLettersDescription"
            defaultText="最大{maxLetters}文字入力できます"
            values={{ maxLetters: internalMaxLetters }}
          />
        )
      },
      [decorators],
    )

    const getCounterMessage = useCallback(
      (counterValue: number) => {
        if (maxLetters === undefined) return

        if (counterValue > maxLetters) {
          // {count}文字オーバー
          return <>{buildmaxLettersExceeded(counterValue - maxLetters)}</>
        }

        // あと{count}文字
        return <>{buildAvailableLetters(maxLetters - counterValue)}</>
      },
      [maxLetters, buildAvailableLetters, buildmaxLettersExceeded],
    )

    const counterVisualMessage = useMemo(() => getCounterMessage(count), [count, getCounterMessage])

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

    const debouncedUpdateCount = useMemo(
      () =>
        maxLetters
          ? debounce((newValue: TextareaValue) => {
              startTransition(() => {
                setCount(getStringLength(newValue))
              })
            }, 200)
          : undefined,
      [maxLetters],
    )

    // countが連続で更新されると、スクリーンリーダーが古い値を読み上げてしまうため、メッセージの更新を遅延しています
    const debouncedUpdateSrCounterMessage = useMemo(
      () =>
        maxLetters
          ? debounce((newValue: TextareaValue) => {
              startTransition(() => {
                const counterText = getCounterMessage(getStringLength(newValue))

                if (counterText) {
                  setSrCounterMessage(counterText)
                }
              })
            }, 1000)
          : undefined,
      [maxLetters, getCounterMessage],
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        debouncedUpdateCount?.(newValue)
        debouncedUpdateSrCounterMessage?.(newValue)

        // rowsを初期化 TextareaのscrollHeightが文字列削除時に変更されないため
        e.target.rows = rows

        if (autoResize) {
          const currentRows = calculateIdealRows(e.target, maxRows)
          // rowsを直接反映 Textareaのrows propsが状態を変更しても反映されないため
          e.target.rows = currentRows
          setInterimRows(currentRows)
        }

        onChange?.(e)
      },
      [onChange, debouncedUpdateCount, debouncedUpdateSrCounterMessage, autoResize, maxRows, rows],
    )

    // autoFocus時に、フォーカスを当てる
    useEffect(() => {
      if (autoFocus && textareaRef && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    // autoResize時に、初期値での高さを指定
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        setInterimRows(calculateIdealRows(textareaRef.current, maxRows))
      }
    }, [setInterimRows, maxRows, autoResize])

    // value 変更時にもカウントを更新する
    useEffect(() => {
      if (value && maxLetters) {
        debouncedUpdateCount?.(value)
        debouncedUpdateSrCounterMessage?.(value)
      }
    }, [maxLetters, debouncedUpdateCount, debouncedUpdateSrCounterMessage, value])

    const textareaStyle = useMemo(
      () => ({ width: typeof width === 'number' ? `${width}px` : width }),
      [width],
    )
    const countError = maxLetters && count > maxLetters
    const classNames = useMemo(() => {
      const { textareaEl, counter } = classNameGenerator()

      return {
        textarea: textareaEl({ className }),
        counter: counter({ error: !!countError }),
      }
    }, [countError, className])

    const body = (
      <textarea
        {...rest}
        {...(maxLetters && { 'aria-describedby': `${maxLettersNoticeId} ${actualMaxLettersId}` })}
        data-smarthr-ui-input="true"
        value={value}
        onChange={handleChange}
        ref={textareaRef}
        aria-invalid={error || countError || undefined}
        rows={interimRows}
        className={classNames.textarea}
        style={textareaStyle}
      />
    )

    return maxLetters ? (
      <span className="shr-relative">
        {body}
        <VisuallyHiddenText id={maxLettersNoticeId}>
          {buildScreenReaderMaxLettersDescription(maxLetters)}
        </VisuallyHiddenText>
        <VisuallyHiddenText aria-live="polite">{srCounterMessage}</VisuallyHiddenText>
        <span id={actualMaxLettersId} aria-hidden={true} className={classNames.counter}>
          {counterVisualMessage}
        </span>
      </span>
    ) : (
      body
    )
  },
)
