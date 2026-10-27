'use client'

import dayjs from 'dayjs'
import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type FC,
  type MouseEvent,
  type ReactNode,
  memo,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../../../hooks/client/useAnimationFrame'
import { useAreaClickCallbackRef } from '../../../../hooks/client/useAreaClickCallbackRef'
import { useLayoutEffectRef } from '../../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useTheme } from '../../../../hooks/client/useTheme'
import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { FaCalendarDaysIcon } from '../../../Icon'
import { Input } from '../../client'

import { Calendar } from './Calendar'
import { Portal } from './Portal'
import { parseJpnDateString } from './warekiPickerHelper'

import type { ExtendElementPropsWithRef } from '../../../../types'

type ChangeLikeEvent = ChangeEvent | React.KeyboardEvent | MouseEvent

type Props = ExtendElementPropsWithRef<
  'input',
  {
    /** input 要素の `value` 属性の値 */
    value?: string | null
    /** 非制御コンポーネントとして使う場合の初期値。`value` を指定した場合は無視される */
    defaultValue?: string | null
    /**
     * placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
     */
    placeholder?: string
    /** 選択可能な期間の開始日 */
    from?: Date
    /** 選択可能な期間の終了日 */
    to?: Date
    /** フォームにエラーがあるかどうか */
    error?: boolean
    /** コンポーネントの幅 */
    width?: number | string
    /** 入力を独自にパースする場合に、パース処理を記述する関数 */
    parseInput?: (input: string) => Date | null
    /** 表示する日付を独自にフォーマットする場合に、フォーマット処理を記述する関数 */
    formatDate?: (date: Date | null) => string
    /**
     * 入出力用文字列と併記する別表記を制御する。
     * - 省略 / `true`: 和暦を別表記として表示する(デフォルト)
     * - `false`: 別表記を表示しない
     * - 関数: その関数の結果を別表記として使う
     */
    showAlternative?: boolean | ((date: Date | null) => ReactNode)
    /** @deprecated onChangeDate は非推奨です。onChange を使ってください。 */
    onChangeDate?: (date: Date | null, value: string, other: { errors: string[] }) => void
    /** 選択された日付が変わった時に発火するコールバック関数 */
    onChange?: (
      e: ChangeEvent<HTMLInputElement>,
      other: { date: Date | null; formatValue: string; errors: string[] },
    ) => void
  },
  { omit: 'type' | 'onKeyPress' | 'onFocus' | 'aria-expanded' | 'aria-controls' | 'aria-haspopup' }
>

const DEFAULT_FROM = new Date(1900, 0, 1)

const classNameGenerator = tv({
  slots: {
    container: 'smarthr-ui-DatePicker shr-inline-block',
    inputSuffixLayout: 'shr-box-border shr-h-full shr-py-0.5',
    inputSuffixWrapper:
      'shr-border-l-shorthand shr-box-border shr-flex shr-h-full shr-items-center shr-justify-center shr-ps-0.5 shr-text-base',
    inputSuffixText: 'shr-text-gray shr-me-0.5 shr-text-sm',
  },
})

const DEFAULT_DATE_TO_STRING_FORMAT = 'YYYY/MM/DD'
const DEFAULT_DATE_TO_STRING = (d: Date | null) =>
  d ? dayjs(d).format(DEFAULT_DATE_TO_STRING_FORMAT) : ''
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/
const SMARTHR_UI_INPUT_SELECTOR = '[data-smarthr-ui-input="true"]'
const INPUT_CONTAINER_CLASS_NAME = 'smarthr-ui-DatePicker-inputContainer'

const parseStringDate = (
  str: string | null | undefined,
  parseInputFn: ((input: string) => Date | null) | undefined,
) => {
  if (!str) return null
  return parseInputFn ? parseInputFn(str) : parseJpnDateString(str)
}

const formatDateValue = (
  date: Date | null,
  formatDateFn: ((date: Date | null) => string) | undefined,
) => (formatDateFn ? formatDateFn(date) : DEFAULT_DATE_TO_STRING(date))

// HINT: showAlternativeは`boolean | 関数`を受け取る。falseなら別表記なし、関数ならその結果をそのまま使い、
// 省略/trueの場合はデフォルトの和暦表記を使う
const resolveAlternativeFormat = (
  date: Date | null,
  showAlternative: boolean | ((date: Date | null) => ReactNode) | undefined,
  locale: string,
): ReactNode => {
  if (!date || showAlternative === false) {
    return null
  }

  if (typeof showAlternative === 'function') {
    return showAlternative(date)
  }

  return date.toLocaleDateString(`${locale}-u-ca-japanese`, { dateStyle: 'long' })
}

export const WarekiPicker: FC<Props> = ({
  value,
  defaultValue,
  name,
  from = DEFAULT_FROM,
  to,
  disabled,
  width,
  error,
  className,
  parseInput,
  formatDate,
  showAlternative,
  onChangeDate,
  onChange,
  onBlur,
  ref,
  ...rest
}) => {
  const theme = useTheme()
  const { locale } = useIntl()
  const classNames = useMemo(() => {
    const { container, inputSuffixLayout, inputSuffixWrapper, inputSuffixText } =
      classNameGenerator()

    return {
      container: container({ className }),
      inputSuffixLayout: inputSuffixLayout(),
      inputSuffixWrapper: inputSuffixWrapper(),
      inputSuffixText: inputSuffixText(),
    }
  }, [className])

  const [isInputFocused, setIsInputFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputRect, setInputRect] = useState<DOMRect | null>(null)
  const calenderId = useId()

  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    parseStringDate(value !== undefined ? value : defaultValue, parseInput),
  )

  // HINT: 非制御時、form.reset()でDOM上のinput.valueはネイティブのdefaultValueへ戻る(マウント時点の値に固定)。
  // selectedDateもそれと同じ基準に戻す必要があるため、マウント後のdefaultValue変更の影響を受けない値を保持しておく
  const [initialSelectedDate] = useState(selectedDate)

  // HINT: selectedDate・showAlternative・localeから導出できる値のため、stateで持たずレンダー中に計算する。
  // selectedDate変更時のみ再計算するstateにすると、showAlternativeだけを切り替えた際に
  // 以前の表示が残ってしまう
  const alternativeFormat = resolveAlternativeFormat(selectedDate, showAlternative, locale)

  const [initialInputValue] = useState<string | undefined>(() => {
    if (value !== undefined || defaultValue === undefined) {
      return undefined
    }

    return selectedDate ? formatDateValue(selectedDate, formatDate) : (defaultValue ?? '')
  })

  const isCalendarShown = !!inputRect

  const closeFrame = useAnimationFrame()

  const latest = useLatest({
    onChange,
    onChangeDate,
    parseInput,
    formatDate,
    showAlternative,
    locale,
    onBlur,
    isInputFocused,
    selectedDate,
    closeFrame,
    initialSelectedDate,
    isControlled: value !== undefined,
  })

  const functions = useMemo(() => {
    let inputNode: HTMLInputElement | null = null
    let calendarNode: HTMLElement | null = null

    const dateToString = (date: Date | null) => formatDateValue(date, latest.formatDate)

    const stringToDate = (str: string | null | undefined) => parseStringDate(str, latest.parseInput)

    const updateDate = (e: ChangeLikeEvent, newDate: Date | null) => {
      if (
        !inputNode ||
        newDate === latest.selectedDate ||
        (newDate && latest.selectedDate && newDate.getTime() === latest.selectedDate.getTime())
      ) {
        // Do not update date if the new date is same with the old one.
        return
      }

      const isValid = !newDate || dayjs(newDate).isValid()
      const errors: string[] = []

      if (!isValid) {
        errors.push('INVALID_DATE')
      }

      const nextDate = isValid ? newDate : null
      const formatValue = dateToString(nextDate)

      inputNode.value = formatValue
      setSelectedDate(nextDate)

      if (latest.onChange) {
        e.preventDefault()
        e.stopPropagation()

        const event = new Event('change', { bubbles: true })

        inputNode.dispatchEvent(event)
        latest.onChange(
          // HINT: 型問題のため別途オブジェクトをイベントに見立てる
          {
            stopPropagation: () => {
              event.stopPropagation()
            },
            preventDefault: () => {
              event.preventDefault()
            },
            target: inputNode,
            currentTarget: inputNode,
          } as ChangeEvent<HTMLInputElement>,
          { date: nextDate, formatValue, errors },
        )
      } else if (latest.onChangeDate) {
        latest.onChangeDate(nextDate, formatValue, { errors })
      }
    }

    const closeCalendar = () => setInputRect(null)

    const openCalendar = () => {
      // HINT: classNameはcontainerに設定されるため、containerの矩形は利用者の指定で変わりうる。
      // カレンダーの表示位置はinput部分を基準にする必要があるため、Inputのwrapperを参照する
      const inputContainer = inputNode?.closest(`.${INPUT_CONTAINER_CLASS_NAME}`)

      if (inputContainer) {
        setInputRect(inputContainer.getBoundingClientRect())
      }
    }

    return {
      stringToDate,
      dateToString,
      closeCalendar,
      openCalendar,
      calendarCallbackRef: (node: HTMLElement | null) => {
        calendarNode = node
      },
      inputCallbackRef: (node: HTMLInputElement | null) => {
        inputNode = node

        if (!node) return

        // HINT: 非制御時、form.reset()(React 19のaction成功時の自動resetを含む)で
        // selectedDate(ひいては和暦alt表示・カレンダーの選択日ハイライト)をマウント時の初期値へ戻すため、
        // resetイベントを監視する。DOM上のinput.value自体はネイティブのdefaultValueへの復帰に任せる
        const associatedForm = node.form
        const handleReset = () => {
          if (!latest.isControlled) {
            setSelectedDate(latest.initialSelectedDate)
          }
        }

        associatedForm?.addEventListener('reset', handleReset)

        const handleKeyDown = (e: KeyboardEvent) => {
          if (!calendarNode || e.key !== 'Tab') {
            return
          }

          const calendarButtons = calendarNode.querySelectorAll('button')

          if (calendarButtons.length === 0) {
            return
          }

          const firstCalendarButton = calendarButtons[0]

          if (latest.isInputFocused) {
            if (e.shiftKey) {
              // move focus from Input to previous elements of WarekiPicker
              closeCalendar()

              return
            }

            // move focus from Input to Calendar
            e.preventDefault()
            firstCalendarButton.focus()

            return
          }

          const calendarButtonAry = Array.from(calendarButtons)
          const currentFocused = calendarButtonAry.find((button) => button === e.target)

          if (e.shiftKey) {
            if (currentFocused === firstCalendarButton) {
              // move focus from Calendar to Input
              node.focus()
              e.preventDefault()
            }
          } else if (currentFocused === calendarButtonAry.at(-1)) {
            // move focus from Calendar to next elements of WarekiPicker
            node.focus()
            closeCalendar()
          }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
          window.removeEventListener('keydown', handleKeyDown)
          associatedForm?.removeEventListener('reset', handleReset)
          latest.closeFrame.cancel()
        }
      },
      handleBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        setIsInputFocused(false)
        updateDate(e, e.target.value ? stringToDate(e.target.value) : null)
        latest.onBlur?.(e)
      },
      handleDelegateKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
        if (ESCAPE_KEY_REGEX.test(e.key)) {
          e.stopPropagation()
          // delay hiding calendar because calendar will be displayed when input is focused
          latest.closeFrame.request(closeCalendar)

          e.currentTarget.querySelector<HTMLInputElement>(SMARTHR_UI_INPUT_SELECTOR)?.focus()
        }
      },
      handleKeyPressInput: (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          const isExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true'
          ;(isExpanded ? closeCalendar : openCalendar)()
          updateDate(e, stringToDate(e.currentTarget.value))
        }
      },
      handleFocusInput: () => {
        setIsInputFocused(true)
        openCalendar()
      },
      handleSelectDateCalendar: (e: ChangeLikeEvent, selected: Date | null) => {
        updateDate(e, selected)
        // delay hiding calendar because calendar will be displayed when input is focused
        latest.closeFrame.request(closeCalendar)

        inputNode?.focus()
      },
    }
  }, [latest])

  const inputLayoutEffectRef = useLayoutEffectRef(
    (node: HTMLInputElement | null) => {
      if (!node || value === undefined) {
        return
      }

      /**
       * Do not format the given value in the following cases
       * - while input element is focused.
       * - if the given value is not date formattable.
       */
      if (!isInputFocused) {
        const newDate = functions.stringToDate(value)

        if (newDate && dayjs(newDate).isValid()) {
          node.value = functions.dateToString(newDate)
          setSelectedDate(newDate)

          return
        }

        setSelectedDate(null)
      }

      node.value = value || ''
    },
    [value, isInputFocused, functions, latest],
  )

  const mergedRef = useMergeRefs(functions.inputCallbackRef, inputLayoutEffectRef, ref)

  const mergedCalendarRef = useMergeRefs(
    useAreaClickCallbackRef(isCalendarShown ? [containerRef] : null, functions.closeCalendar),
    functions.calendarCallbackRef,
  )

  const caretIconColor =
    isInputFocused || isCalendarShown
      ? theme.textColor.black
      : disabled
        ? theme.textColor.disabled
        : theme.textColor.grey

  return (
    // eslint-disable-next-line smarthr/best-practice-for-interactive-element
    <div
      ref={containerRef}
      role="presentation"
      className={classNames.container}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
      }}
      onClick={!isCalendarShown && !disabled ? functions.openCalendar : undefined}
      onKeyDown={isCalendarShown ? functions.handleDelegateKeyDown : undefined}
    >
      <Input
        {...rest}
        ref={mergedRef}
        name={name}
        disabled={disabled}
        defaultValue={initialInputValue}
        error={error}
        width="100%"
        className={INPUT_CONTAINER_CLASS_NAME}
        aria-expanded={isCalendarShown}
        aria-controls={calenderId}
        aria-haspopup={true}
        onChange={isCalendarShown ? functions.closeCalendar : undefined}
        onKeyPress={functions.handleKeyPressInput}
        onFocus={functions.handleFocusInput}
        onBlur={functions.handleBlur}
        suffix={
          <InputSuffixIcon
            alternativeFormat={alternativeFormat}
            caretIconColor={caretIconColor}
            classNames={classNames}
          />
        }
      />
      {inputRect && (
        <Portal inputRect={inputRect}>
          <Calendar
            ref={mergedCalendarRef}
            id={calenderId}
            value={selectedDate || undefined}
            from={from}
            to={to}
            onSelectDate={functions.handleSelectDateCalendar}
          />
        </Portal>
      )}
    </div>
  )
}

const InputSuffixIcon = memo<{
  classNames: { inputSuffixLayout: string; inputSuffixWrapper: string; inputSuffixText: string }
  alternativeFormat: ReactNode
  caretIconColor: ComponentPropsWithRef<typeof FaCalendarDaysIcon>['color']
}>(({ classNames, alternativeFormat, caretIconColor }) => (
  <span className={classNames.inputSuffixLayout}>
    <span className={classNames.inputSuffixWrapper}>
      {alternativeFormat && <span className={classNames.inputSuffixText}>{alternativeFormat}</span>}
      <FaCalendarDaysIcon color={caretIconColor} />
    </span>
  </span>
))
