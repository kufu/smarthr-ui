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

import { useAnimationFrame } from '../../../../../hooks/client/useAnimationFrame'
import { useAreaClickCallbackRef } from '../../../../../hooks/client/useAreaClickCallbackRef'
import { useLayoutEffectRef } from '../../../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../../../hooks/client/useMergeRefs'
import { useTheme } from '../../../../../hooks/client/useTheme'
import { useLatest } from '../../../../../hooks/useLatest'
import { FaCalendarDaysIcon } from '../../../../Icon'
import { Input } from '../../../client'
import { Calendar } from '../Calendar'

import { Portal } from './Portal'
import { parseJpnDateString } from './datePickerHelper'

import type { ExtendElementPropsWithRef } from '../../../../../types'

type ChangeLikeEvent = ChangeEvent | React.KeyboardEvent | MouseEvent

type Props = ExtendElementPropsWithRef<
  'input',
  {
    /** input 要素の `value` 属性の値 */
    value?: string | null
    /** 非制御コンポーネントとして使う場合の初期値。`value` を指定した場合は無視される */
    defaultValue?: string | null
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
  },
  { omit: 'type' | 'onKeyPress' | 'onFocus' | 'aria-expanded' | 'aria-controls' | 'aria-haspopup' }
>

const DEFAULT_FROM = new Date(1900, 0, 1)

const INPUT_CONTAINER_CLASS_NAME = 'smarthr-ui-DatePicker-inputContainer'

const classNameGenerator = tv({
  slots: {
    container: 'smarthr-ui-DatePicker shr-inline-block',
    inputContainer: INPUT_CONTAINER_CLASS_NAME,
    inputSuffixIconWrapper:
      'shr-border-l-shorthand shr-box-border shr-flex shr-items-center shr-justify-center shr-ps-0.5 shr-text-base',
    alternativeFormatWrapper:
      'smarthr-ui-DatePicker-alternativeFormatWrapper shr-text-gray shr-me-0.5 shr-ms-0.5 shr-py-0.5 shr-text-sm',
  },
  variants: {
    hasAlternative: {
      /* 和暦テキストが画面幅に収まらない場合は input の最小幅(10ch)を下限として flex-wrap で下段へ折り返す。
       * ⚠️ Input 内部のクラス名に依存するため、Input を変更する場合は要注意 */
      true: {
        inputContainer: [
          'shr-flex-wrap shr-gap-y-0',
          '[&_.smarthr-ui-Input-suffix]:shr-contents',
          '[&_.smarthr-ui-Input-input]:shr-w-auto [&_.smarthr-ui-Input-input]:shr-min-w-[10ch] [&_.smarthr-ui-Input-input]:shr-basis-[10ch]',
          '[&_.smarthr-ui-DatePicker-alternativeFormatWrapper]:shr-ms-0',
          /* 折り返し時のみ上段と下段の間に点線を出す。1行時は線の位置が下の枠線に重なり、枠線に隠れて見えない */
          '[background-image:repeating-linear-gradient(to_right,theme(borderColor.default)_0_2px,transparent_2px_4px)]',
          '[background-origin:content-box]',
          '[background-position:0_calc(theme(fontSize.base)_+_theme(spacing[0.75])_*_2)]',
          '[background-size:100%_1px]',
          '[background-repeat:no-repeat]',
        ],
      },
    },
  },
})

const DEFAULT_DATE_TO_STRING_FORMAT = 'YYYY/MM/DD'
const DEFAULT_DATE_TO_STRING = (d: Date | null) =>
  d ? dayjs(d).format(DEFAULT_DATE_TO_STRING_FORMAT) : ''
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/
const SMARTHR_UI_INPUT_SELECTOR = '[data-smarthr-ui-input="true"]'

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

/** @deprecated DatePicker は非推奨です。WarekiPicker を使ってください。 */
export const DatePicker: FC<Props> = ({
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
  const hasAlternative = !!showAlternative
  const classNames = useMemo(() => {
    const { container, inputContainer, inputSuffixIconWrapper, alternativeFormatWrapper } =
      classNameGenerator()

    return {
      container: container({ className }),
      inputContainer: inputContainer({ hasAlternative }),
      inputSuffixIconWrapper: inputSuffixIconWrapper(),
      alternativeFormatWrapper: alternativeFormatWrapper(),
    }
  }, [className, hasAlternative])

  const [isInputFocused, setIsInputFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [inputRect, setInputRect] = useState<DOMRect | null>(null)
  const calenderId = useId()

  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    parseStringDate(value !== undefined ? value : defaultValue, parseInput),
  )

  const [alternativeFormat, setAlternativeFormat] = useState<null | ReactNode>(() =>
    selectedDate && showAlternative ? showAlternative(selectedDate) : null,
  )

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
    onBlur,
    isInputFocused,
    selectedDate,
    closeFrame,
  })

  const functions = useMemo(() => {
    let inputNode: HTMLInputElement | null = null
    let calendarNode: HTMLElement | null = null

    const dateToString = (date: Date | null) => formatDateValue(date, latest.formatDate)

    const dateToAlternativeFormat = (d: Date | null) => {
      if (d && latest.showAlternative) return latest.showAlternative(d)
      return null
    }

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

      if (latest.showAlternative) {
        setAlternativeFormat(dateToAlternativeFormat(nextDate))
      }

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
      dateToAlternativeFormat,
      closeCalendar,
      openCalendar,
      calendarCallbackRef: (node: HTMLElement | null) => {
        calendarNode = node
      },
      inputCallbackRef: (node: HTMLInputElement | null) => {
        inputNode = node

        if (!node) return

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

          if (latest.showAlternative) {
            setAlternativeFormat(functions.dateToAlternativeFormat(newDate))
          }

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
        className={classNames.inputContainer}
        aria-expanded={isCalendarShown}
        aria-controls={calenderId}
        aria-haspopup={true}
        onChange={isCalendarShown ? functions.closeCalendar : undefined}
        onKeyPress={functions.handleKeyPressInput}
        onFocus={functions.handleFocusInput}
        onBlur={functions.handleBlur}
        suffix={
          <InputSuffix
            alternativeFormat={showAlternative ? alternativeFormat : null}
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

const InputSuffix = memo<{
  classNames: { inputSuffixIconWrapper: string; alternativeFormatWrapper: string }
  alternativeFormat: null | ReactNode
  caretIconColor: ComponentPropsWithRef<typeof FaCalendarDaysIcon>['color']
}>(({ classNames, alternativeFormat, caretIconColor }) => (
  <>
    <span className={classNames.inputSuffixIconWrapper}>
      <FaCalendarDaysIcon color={caretIconColor} />
    </span>
    {alternativeFormat && (
      <span className={classNames.alternativeFormatWrapper}>{alternativeFormat}</span>
    )}
  </>
))
