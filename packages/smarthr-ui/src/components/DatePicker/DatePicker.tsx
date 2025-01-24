'use client'

import dayjs from 'dayjs'
import React, {
  ComponentPropsWithRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useOuterClick } from '../../hooks/useOuterClick'
import { textColor } from '../../themes'
import { Calendar } from '../Calendar'
import { FaCalendarAltIcon } from '../Icon'
import { Input } from '../Input'

import { Portal } from './Portal'
import { parseJpnDateString } from './datePickerHelper'
import { useGlobalKeyDown } from './useGlobalKeyDown'

type Props = {
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
   * @deprecated placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
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
  /** 選択された日付が変わった時に発火するコールバック関数 */
  onChangeDate?: (date: Date | null, value: string, other: { errors: string[] }) => void
}
type OmitInputAttributes =
  | keyof Props
  | 'type'
  | 'onChange'
  | 'onKeyPress'
  | 'onFocus'
  | 'aria-expanded'
  | 'aria-controls'
  | 'aria-haspopup'
type InputAttributes = Omit<ComponentPropsWithRef<'input'>, OmitInputAttributes>

export const DEFAULT_FROM = new Date(1900, 0, 1)

const datePicker = tv({
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
const RETURN_NULL = () => null
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

/** @deprecated DatePicker は非推奨です。Input[type=date] を使ってください。 */
export const DatePicker = forwardRef<HTMLInputElement, Props & InputAttributes>(
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
      onBlur,
      ...inputAttrs
    },
    ref,
  ) => {
    const containerStyleAttr = useMemo(
      () => ({
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      [width],
    )
    const {
      containerStyle,
      inputSuffixLayoutStyle,
      inputSuffixWrapperStyle,
      inputSuffixTextStyle,
    } = useMemo(() => {
      const { container, inputSuffixLayout, inputSuffixWrapper, inputSuffixText } = datePicker()

      return {
        containerStyle: container({ className }),
        inputSuffixLayoutStyle: inputSuffixLayout(),
        inputSuffixWrapperStyle: inputSuffixWrapper(),
        inputSuffixTextStyle: inputSuffixText(),
      }
    }, [className])

    const stringToDate = useMemo(
      () =>
        parseInt
          ? (str?: string | null) => (str ? parseInput(str) : undefined)
          : (str?: string | null) => (str ? parseJpnDateString(str) : undefined),
      [parseInput],
    )

    const dateToString = useMemo(() => formatDate || DEFAULT_DATE_TO_STRING, [formatDate])
    const dateToAlternativeFormat = useMemo(
      () => (showAlternative ? (d: Date | null) => (d ? showAlternative(d) : null) : RETURN_NULL),
      [showAlternative],
    )

    const [selectedDate, setSelectedDate] = useState<Date | null>(stringToDate(value))
    const inputRef = useRef<HTMLInputElement>(null)
    const inputWrapperRef = useRef<HTMLDivElement>(null)
    const calendarPortalRef = useRef<HTMLDivElement>(null)
    const [inputRect, setInputRect] = useState<DOMRect | null>(null)
    const [isInputFocused, setIsInputFocused] = useState(false)
    const [isCalendarShown, setIsCalendarShown] = useState(false)
    const [alternativeFormat, setAlternativeFormat] = useState<null | ReactNode>(null)
    const calenderId = useId()

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
    )

    const baseUpdateDate = useCallback(
      (newDate: Date | null) => {
        if (
          !inputRef.current ||
          newDate === selectedDate ||
          (newDate && selectedDate && newDate.getTime() === selectedDate.getTime())
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

        inputRef.current.value = dateToString(nextDate)
        setAlternativeFormat(dateToAlternativeFormat(nextDate))
        setSelectedDate(nextDate)

        return [nextDate, errors]
      },
      [selectedDate, dateToString, dateToAlternativeFormat],
    )
    const updateDate = useMemo(
      () =>
        onChangeDate
          ? (newDate: Date | null) => {
              const result = baseUpdateDate(newDate)

              if (result) {
                const [nextDate, errors] = result

                onChangeDate(nextDate, inputRef.current.value, { errors })
              }
            }
          : baseUpdateDate,
      [onChangeDate, baseUpdateDate],
    )

    const closeCalendar = useCallback(() => setIsCalendarShown(false), [])
    const openCalendar = useCallback(() => {
      if (inputWrapperRef.current) {
        setIsCalendarShown(true)
        setInputRect(inputWrapperRef.current.getBoundingClientRect())
      }
    }, [])
    const switchCalendarVisibility = useCallback(
      (isVisible: boolean) => (isVisible ? closeCalendar() : openCalendar()),
      [closeCalendar, openCalendar],
    )

    useEffect(() => {
      if (value === undefined || !inputRef.current) {
        return
      }

      /**
       * Do not format the given value in the following cases
       * - while input element is focused.
       * - if the given value is not date formattable.
       */
      if (!isInputFocused) {
        const newDate = stringToDate(value)

        if (newDate && dayjs(newDate).isValid()) {
          inputRef.current.value = dateToString(newDate)
          setAlternativeFormat(dateToAlternativeFormat(newDate))
          setSelectedDate(newDate)

          return
        }

        setSelectedDate(null)
      }

      inputRef.current.value = value || ''
    }, [value, isInputFocused, dateToString, dateToAlternativeFormat, stringToDate])

    useOuterClick([inputWrapperRef, calendarPortalRef], closeCalendar)

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!inputRef.current || !calendarPortalRef.current || e.key !== 'Tab') {
          return
        }

        const calendarButtons = calendarPortalRef.current.querySelectorAll('button')

        if (calendarButtons.length === 0) {
          return
        }

        const firstCalendarButton = calendarButtons[0]

        if (isInputFocused) {
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
            inputRef.current.focus()
            e.preventDefault()
          }
        } else if (currentFocused === calendarButtonAry.at(-1)) {
          // move focus from Calendar to next elements of DatePicker
          inputRef.current.focus()
          closeCalendar()
        }
      },
      [isInputFocused, closeCalendar],
    )

    const baseHandleBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>(
      (e) => {
        setIsInputFocused(false)
        updateDate(e.target.value ? stringToDate(e.target.value) : null)
      },
      [stringToDate, updateDate],
    )
    const handleBlur = useMemo<React.FocusEventHandler<HTMLInputElement>>(
      () =>
        onBlur
          ? (e) => {
              baseHandleBlur(e)
              onBlur(e)
            }
          : baseHandleBlur,
      [onBlur, baseHandleBlur],
    )

    useGlobalKeyDown(handleKeyDown)

    const caretIconColor = useMemo(() => {
      if (isInputFocused || isCalendarShown) return textColor.black
      if (disabled) return textColor.disabled

      return textColor.grey
    }, [isInputFocused, isCalendarShown, disabled])

    const onDelegateClick = useMemo(
      () => (!isCalendarShown && !disabled ? openCalendar : undefined),
      [isCalendarShown, disabled, openCalendar],
    )
    const baseOnDelegateKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (ESCAPE_KEY_REGEX.test(e.key)) {
          e.stopPropagation()
          requestAnimationFrame(closeCalendar)

          if (inputRef.current) inputRef.current.focus()
        }
      },
      [closeCalendar],
    )
    const onDelegateKeyDown = useMemo(
      () => (isCalendarShown ? baseOnDelegateKeyDown : undefined),
      [isCalendarShown, baseOnDelegateKeyDown],
    )
    const onChangeInput = useMemo(
      () => (isCalendarShown ? closeCalendar : undefined),
      [isCalendarShown, closeCalendar],
    )
    const onKeyPressInput = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          switchCalendarVisibility(!isCalendarShown)
          updateDate(stringToDate(e.currentTarget.value))
        }
      },
      [isCalendarShown, updateDate, switchCalendarVisibility],
    )
    const onFocusInput = useCallback(() => {
      setIsInputFocused(true)
      openCalendar()
    }, [openCalendar])
    const onSelectDateCalendar = useCallback(
      (_: any, selected: Date | null) => {
        updateDate(selected)
        // delay hiding calendar because calendar will be displayed when input is focused
        requestAnimationFrame(closeCalendar)

        if (inputRef.current) inputRef.current.focus()
      },
      [updateDate, closeCalendar],
    )

    return (
      <div
        onClick={onDelegateClick}
        onKeyDown={onDelegateKeyDown}
        role="presentation"
        className={containerStyle}
        style={containerStyleAttr}
      >
        <div ref={inputWrapperRef}>
          <Input
            {...inputAttrs}
            data-smarthr-ui-input="true"
            width="100%"
            name={name}
            onChange={onChangeInput}
            onKeyPress={onKeyPressInput}
            onFocus={onFocusInput}
            onBlur={handleBlur}
            suffix={
              <span className={inputSuffixLayoutStyle}>
                <span className={inputSuffixWrapperStyle}>
                  {showAlternative && (
                    <span className={inputSuffixTextStyle}>{alternativeFormat}</span>
                  )}
                  <FaCalendarAltIcon color={caretIconColor} />
                </span>
              </span>
            }
            disabled={disabled}
            error={error}
            ref={inputRef}
            className="smarthr-ui-DatePicker-inputContainer"
            aria-expanded={isCalendarShown}
            aria-controls={calenderId}
            aria-haspopup={true}
          />
        </div>
        {isCalendarShown && inputRect && (
          <Portal inputRect={inputRect} ref={calendarPortalRef}>
            <Calendar
              id={calenderId}
              value={selectedDate || undefined}
              from={from}
              to={to}
              onSelectDate={onSelectDateCalendar}
            />
          </Portal>
        )}
      </div>
    )
  },
)
