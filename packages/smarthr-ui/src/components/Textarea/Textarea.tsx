'use client'

import {
  type ChangeEvent,
  type ComponentProps,
  type ComponentPropsWithRef,
  type FC,
  type ReactNode,
  type Ref,
  forwardRef,
  startTransition,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../hooks/client/useMergeRefs'
import { useOnce } from '../../hooks/client/useOnce'
import { useTheme } from '../../hooks/client/useTheme'
import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
import { debounce } from '../../libs/debounce'
import { defaultHtmlFontSize } from '../../themes'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type BaseProps = {
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
type Props = BaseProps & Omit<ComponentPropsWithRef<'textarea'>, keyof BaseProps>
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
  base: [
    'smarthr-ui-Textarea-textarea',
    'shr-border-shorthand shr-my-[unset] shr-box-border shr-rounded-m shr-bg-white shr-p-0.5 shr-text-base shr-leading-normal shr-text-black shr-opacity-100',
    'contrast-more:shr-border-high-contrast',
    'placeholder:shr-text-grey',
    'focus-visible:shr-focus-indicator',
    'disabled:shr-pointer-events-none disabled:shr-bg-column disabled:shr-text-disabled disabled:placeholder:shr-text-disabled',
    'aria-[invalid]:shr-border-danger',
  ],
})

const calculateIdealRows = (
  node: HTMLTextAreaElement | null | undefined,
  maxRows: number,
  lineHeightNormal: number,
): number => {
  if (!node) {
    return 0
  }

  // 現在の入力値に応じた行数
  const currentInputValueRows = Math.floor(
    node.scrollHeight / (defaultHtmlFontSize * lineHeightNormal),
  )

  return currentInputValueRows < maxRows ? currentInputValueRows : maxRows
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ maxLetters, ...rest }, ref) =>
  maxLetters ? (
    <MaxLettersTextarea {...rest} externalRef={ref} maxLetters={maxLetters} />
  ) : (
    <ActualTextarea {...rest} externalRef={ref} />
  ),
)

type LocalTextareaProps = ComponentProps<typeof Textarea> & {
  externalRef?: Ref<HTMLTextAreaElement>
}

const MaxLettersTextarea: FC<
  Omit<LocalTextareaProps, 'maxLetters'> & {
    maxLetters: number
  }
> = ({ maxLetters, error, value, defaultValue, onChange, id, ...rest }) => {
  const maxLettersId = useId()
  const textareaId = id || `${maxLettersId}-textarea`
  const maxLettersNoticeId = `${maxLettersId}-notice`

  const counterSpanRef = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(() => {
    const currentValue = defaultValue || value
    return currentValue ? getStringLength(currentValue) : 0
  })
  const [srCounterMessage, setSrCounterMessage] = useState<ReactNode>('')

  const countError = count > maxLetters

  const latest = useLatest({
    onChange,
  })

  const functions = useMemo(() => {
    // counter spanのテキスト変更を監視してスクリーンリーダーメッセージを更新
    // countが連続で更新されると、スクリーンリーダーが古い値を読み上げてしまうため、メッセージの更新を遅延しています
    const updateSrMessage = debounce(() => {
      startTransition(() => {
        if (counterSpanRef.current) {
          setSrCounterMessage(counterSpanRef.current.textContent || '')
        }
      })
    }, 1000)
    const actualUpdateCount = debounce((newValue: TextareaValue) => {
      startTransition(() => {
        setCount(getStringLength(newValue))
      })
    }, 200)

    // 初回レンダリング時はスクリーンリーダー向けメッセージなどを更新したくないためskipする
    // (実際のユーザー操作による変更でのみ更新すれば良い)
    // useEffectでupdateCountが必ず呼びだされる
    let firstCallUpdateCount = true
    const updateCount = (newValue: TextareaValue) => {
      if (firstCallUpdateCount) {
        firstCallUpdateCount = false
        return
      }

      actualUpdateCount(newValue)
      updateSrMessage()
    }

    return {
      updateCount,
      cancelDebounce: () => {
        updateSrMessage.cancel()
        actualUpdateCount.cancel()
      },
      handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
        updateCount(e.target.value)
        latest.onChange?.(e)
      },
    }
  }, [latest])

  useEffect(() => {
    functions.updateCount(value ?? '')
    return functions.cancelDebounce
  }, [value, functions])

  return (
    <span className="shr-relative">
      <ActualTextarea
        {...rest}
        id={textareaId}
        value={value}
        defaultValue={defaultValue}
        error={error || countError}
        aria-describedby={`${maxLettersNoticeId} ${maxLettersId}`}
        onChange={functions.handleChange}
      />
      <VisuallyHiddenText id={maxLettersNoticeId}>
        <Localizer
          id="smarthr-ui/Textarea/screenReaderMaxLettersDescription"
          defaultText="最大{maxLetters}文字入力できます"
          values={{ maxLetters }}
        />
      </VisuallyHiddenText>
      <VisuallyHiddenText as="output" role="status" htmlFor={textareaId}>
        {srCounterMessage}
      </VisuallyHiddenText>
      <span
        ref={counterSpanRef}
        id={maxLettersId}
        className="smarthr-ui-Textarea-counter shr-block shr-text-sm shr-text-black data-[error]:shr-text-danger"
        aria-hidden={true}
        data-error={countError || undefined}
      >
        {count > maxLetters ? (
          <Localizer
            id="smarthr-ui/Textarea/maxLettersExceeded"
            defaultText="{exceededLetters}文字オーバー"
            values={{ exceededLetters: count - maxLetters }}
          />
        ) : (
          <Localizer
            id="smarthr-ui/Textarea/availableLetters"
            defaultText="あと{availableLetters}文字"
            values={{ availableLetters: maxLetters - count }}
          />
        )}
      </span>
    </span>
  )
}

const ActualTextarea: FC<Omit<LocalTextareaProps, 'maxLetters'>> = ({
  autoFocus,
  width,
  className,
  autoResize = false,
  maxRows = Infinity,
  rows = 2,
  error,
  onChange,
  externalRef,
  ...rest
}) => {
  const theme = useTheme()
  const [interimRows, setInterimRows] = useState(rows)

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  const latest = useLatest({
    onChange,
    autoFocus,
    autoResize,
    maxRows,
    theme,
    rows,
  })

  const functions = useMemo(
    () => ({
      baseCallbackRef: (node: HTMLTextAreaElement | null) => {
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

  const mergedRef = useMergeRefs(useOnce(functions.baseCallbackRef), externalRef)

  return (
    <textarea
      {...rest}
      ref={mergedRef}
      rows={interimRows}
      className={actualClassName}
      style={{ width: typeof width === 'number' ? `${width}px` : width }}
      aria-invalid={error || undefined}
      data-smarthr-ui-input="true"
      onChange={functions.handleChange}
    />
  )
}
