'use client'

import dayjs from 'dayjs'
import {
  type ChangeEvent,
  type ComponentProps,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
  forwardRef,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../hooks/useAnimationFrame'
import { useLatest } from '../../hooks/useLatest'
import { useMergeRefs } from '../../hooks/useMergeRefs'
import { useOuterClick } from '../../hooks/useOuterClick'
import { useTheme } from '../../hooks/useTheme'
import { Calendar } from '../Calendar'
import { FaCalendarDaysIcon } from '../Icon'
import { Input } from '../Input'

import { Portal } from './Portal'
import { parseJpnDateString } from './datePickerHelper'

type ChangeLikeEvent = ChangeEvent | React.KeyboardEvent | MouseEvent
type BaseProps = {
  /** input 要素の `value` 属性の値 */
  value?: string | null
  /** input 要素の `name` 属性の値 */
  name?: string
  /** 選択可能な期間の開始日 */
  from?: Date
  /** 選択可能な期間の終了日 */
  to?: Date
  /** フォームを無効にするかどうか */
  disabled?: boolean
  /**
   * placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
   */
  placeholder?: string
  /** フォームにエラーがあるかどうか */
  error?: boolean
  /** コンポーネントの幅 */
  width?: number | string
  /** 入力を独自にパースする場合に、パース処理を記述する関数 */
  parseInput?: (input: string) => Date | null
  /** 表示する日付を独自にフォーマットする場合に、フォーマット処理を記述する関数 */
  formatDate?: (date: Date | null) => string
  /** 入出力用文字列と併記する別フォーマット処理を記述する関数 */
  showAlternative?: (date: Date | null) => ReactNode
  /** @deprecated onChangeDate は非推奨です。onChange を使ってください。 */
  onChangeDate?: (date: Date | null, value: string, other: { errors: string[] }) => void
  /** 選択された日付が変わった時に発火するコールバック関数 */
  onChange?: (
    e: ChangeEvent<HTMLInputElement>,
    other: { date: Date | null; formatValue: string; errors: string[] },
  ) => void
}
type Props = BaseProps &
  Omit<
    ComponentPropsWithRef<'input'>,
    | keyof BaseProps
    | 'type'
    | 'onChange'
    | 'onKeyPress'
    | 'onFocus'
    | 'aria-expanded'
    | 'aria-controls'
    | 'aria-haspopup'
  >

export const DEFAULT_FROM = new Date(1900, 0, 1)

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

const parseStringDate = (
  str: string | null | undefined,
  parseInputFn: ((input: string) => Date | null) | undefined,
) => {
  if (!str) return null
  return parseInputFn ? parseInputFn(str) : parseJpnDateString(str)
}

/** @deprecated DatePicker は非推奨です。Input[type=date] を使ってください。 */
export const DatePicker = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
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
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme()
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
    const calendarPortalRef = useRef<HTMLDivElement>(null)
    const [inputRect, setInputRect] = useState<DOMRect | null>(null)
    const [isCalendarShown, setIsCalendarShown] = useState(false)
    const [alternativeFormat, setAlternativeFormat] = useState<null | ReactNode>(null)
    const calenderId = useId()

    const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
      parseStringDate(value, parseInput),
    )

    const closeFrame = useAnimationFrame()

    const latest = useLatest({
      onChange,
      onChangeDate,
      parseInput,
      formatDate,
      showAlternative,
      onBlur,
      isInputFocused,
      selectedDate,
      closeFrame,
    })

    const functions = useMemo(() => {
      // HINT: data-smarthr-ui-input はInput側が必ずinput要素に付与する
      const getInput = () =>
        containerRef.current?.querySelector<HTMLInputElement>('[data-smarthr-ui-input="true"]') ??
        null

      const dateToString = (date: Date | null) =>
        latest.formatDate ? latest.formatDate(date) : DEFAULT_DATE_TO_STRING(date)

      const dateToAlternativeFormat = (d: Date | null) => {
        if (d && latest.showAlternative) return latest.showAlternative(d)
        return null
      }

      const stringToDate = (str: string | null | undefined) =>
        parseStringDate(str, latest.parseInput)

      const updateDate = (e: ChangeLikeEvent, newDate: Date | null) => {
        const input = getInput()

        if (
          !input ||
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

        input.value = formatValue

        if (latest.showAlternative) {
          setAlternativeFormat(dateToAlternativeFormat(nextDate))
        }

        setSelectedDate(nextDate)

        if (latest.onChange) {
          e.preventDefault()
          e.stopPropagation()

          const event = new Event('change', { bubbles: true })

          input.dispatchEvent(event)
          latest.onChange(
            // HINT: 型問題のため別途オブジェクトをイベントに見立てる
            {
              stopPropagation: () => {
                event.stopPropagation()
              },
              preventDefault: () => {
                event.preventDefault()
              },
              target: input,
              currentTarget: input,
            } as ChangeEvent<HTMLInputElement>,
            { date: nextDate, formatValue, errors },
          )
        } else if (latest.onChangeDate) {
          latest.onChangeDate(nextDate, formatValue, { errors })
        }
      }

      const closeCalendar = () => setIsCalendarShown(false)

      const openCalendar = () => {
        if (containerRef.current) {
          setIsCalendarShown(true)
          setInputRect(containerRef.current.getBoundingClientRect())
        }
      }

      return {
        getInput,
        stringToDate,
        dateToString,
        dateToAlternativeFormat,
        closeCalendar,
        openCalendar,
        inputCallbackRef: (node: HTMLInputElement | null) => {
          if (!node) return

          const handleKeyDown = (e: KeyboardEvent) => {
            if (!calendarPortalRef.current || e.key !== 'Tab') {
              return
            }

            const calendarButtons = calendarPortalRef.current.querySelectorAll('button')

            if (calendarButtons.length === 0) {
              return
            }

            const firstCalendarButton = calendarButtons[0]

            if (latest.isInputFocused) {
              if (e.shiftKey) {
                // move focus from Input to previous elements of DatePicker
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
              // move focus from Calendar to next elements of DatePicker
              node.focus()
              closeCalendar()
            }
          }

          window.addEventListener('keydown', handleKeyDown)

          return () => {
            window.removeEventListener('keydown', handleKeyDown)
            latest.closeFrame.cancel()
          }
        },
        handleBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          setIsInputFocused(false)
          updateDate(e, e.target.value ? stringToDate(e.target.value) : null)
          latest.onBlur?.(e)
        },
        handleDelegateKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (ESCAPE_KEY_REGEX.test(e.key)) {
            e.stopPropagation()
            // delay hiding calendar because calendar will be displayed when input is focused
            latest.closeFrame.request(closeCalendar)

            getInput()?.focus()
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

          getInput()?.focus()
        },
      }
    }, [latest])

    // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
    // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
    const mergedRef = useMergeRefs(functions.inputCallbackRef, ref)

    useOuterClick([containerRef, calendarPortalRef], functions.closeCalendar)

    useEffect(() => {
      const input = functions.getInput()

      if (value === undefined || !input) {
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
          input.value = functions.dateToString(newDate)

          if (latest.showAlternative) {
            setAlternativeFormat(functions.dateToAlternativeFormat(newDate))
          }

          setSelectedDate(newDate)

          return
        }

        setSelectedDate(null)
      }

      input.value = value || ''
    }, [value, isInputFocused, functions, latest])

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
        onClick={!isCalendarShown && !disabled ? functions.openCalendar : undefined}
        onKeyDown={isCalendarShown ? functions.handleDelegateKeyDown : undefined}
        role="presentation"
        className={classNames.container}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
        }}
      >
        <Input
          {...rest}
          width="100%"
          name={name}
          onChange={isCalendarShown ? functions.closeCalendar : undefined}
          onKeyPress={functions.handleKeyPressInput}
          onFocus={functions.handleFocusInput}
          onBlur={functions.handleBlur}
          suffix={
            <InputSuffixIcon
              alternativeFormat={showAlternative ? alternativeFormat : null}
              caretIconColor={caretIconColor}
              classNames={classNames}
            />
          }
          disabled={disabled}
          error={error}
          ref={mergedRef}
          className="smarthr-ui-DatePicker-inputContainer"
          aria-expanded={isCalendarShown}
          aria-controls={calenderId}
          aria-haspopup={true}
        />
        {isCalendarShown && inputRect && (
          <Portal inputRect={inputRect}>
            <Calendar
              ref={calendarPortalRef}
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
  },
)

const InputSuffixIcon = memo<{
  classNames: { inputSuffixLayout: string; inputSuffixWrapper: string; inputSuffixText: string }
  alternativeFormat: null | ReactNode
  caretIconColor: ComponentProps<typeof FaCalendarDaysIcon>['color']
}>(({ classNames, alternativeFormat, caretIconColor }) => (
  <span className={classNames.inputSuffixLayout}>
    <span className={classNames.inputSuffixWrapper}>
      {alternativeFormat && <span className={classNames.inputSuffixText}>{alternativeFormat}</span>}
      <FaCalendarDaysIcon color={caretIconColor} />
    </span>
  </span>
))
