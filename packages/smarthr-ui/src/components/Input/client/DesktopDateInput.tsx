'use client'

import dayjs from 'dayjs'
import { type ChangeEvent, type FC, type MouseEvent, useId, useMemo, useRef, useState } from 'react'

import { useAnimationFrame } from '../../../hooks/client/useAnimationFrame'
import { useAreaClickCallbackRef } from '../../../hooks/client/useAreaClickCallbackRef'
import { useLayoutEffectRef } from '../../../hooks/client/useLayoutEffectRef'
import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useOnce } from '../../../hooks/client/useOnce'
import { useTheme } from '../../../hooks/client/useTheme'
import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { formatWarekiDate } from '../../../libs/formatWarekiDate'
import { parseJpnDateString } from '../../../libs/parseJpnDateString'
import { Calendar, CalendarPortal, CalendarValueSuffix } from '../../Calendar'

import { backgroundColor, classNameGenerator } from './inputStyle'

import type { Props } from './type'

type ChangeLikeEvent = ChangeEvent | React.KeyboardEvent | MouseEvent

// HINT: ネイティブdate inputとのvalue/onChange互換性維持のため、表示・入出力ともISO(YYYY-MM-DD)形式に固定する。
// 和暦など読みやすい表記はCalendarValueSuffixの別表記側で担保する
const dateToIsoString = (date: Date | null) => (date ? dayjs(date).format('YYYY-MM-DD') : '')
const stringToDate = (str: string | null | undefined) => (str ? parseJpnDateString(str) : null)

const DEFAULT_FROM = new Date(1900, 0, 1)
const DEFAULT_TO = new Date(9999, 11, 31)
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

/**
 * `Input`の`type="date"`かつデスクトップ環境の場合に使用する、カレンダーUI付きの編集画面。
 * ネイティブdate inputの実害(コピペ不可、Chromeでの年6桁入力、ブラウザ間のUI差異)を避けつつ、
 * value/onChangeの文字列形式(ISO `YYYY-MM-DD`)はネイティブdate inputと同じ契約を維持する。
 */
export const DesktopDateInput: FC<Props> = ({
  value,
  defaultValue,
  prefix,
  className,
  width,
  error,
  bgColor,
  autoFocus,
  disabled,
  min,
  max,
  ref,
  onChange,
  onBlur,
  // HINT: このコンポーネント自体が常にtype="date"として使われる(呼び出し元のInput.tsxで判定済み)ため、
  // ネイティブinputには渡さない。渡すとtype=dateネイティブUIのaria role計算が有効になってしまう
  type: _type,
  // HINT: カレンダー展開の制御に内部的に使用するため、利用者指定のものがあっても使わない
  onFocus: _onFocus,
  onKeyPress: _onKeyPress,
  'aria-expanded': _ariaExpanded,
  'aria-controls': _ariaControls,
  'aria-haspopup': _ariaHaspopup,
  // HINT: suffixはカレンダーアイコン＋和暦alt表示が占有するため、利用者指定のものがあっても使わない
  suffix: _suffix,
  ...rest
}) => {
  const theme = useTheme()
  const { locale } = useIntl()

  const classNames = useMemo(() => {
    const { wrapper, input, affix } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      input: input(),
      prefix: affix({ className: 'smarthr-ui-Input-prefix' }),
      suffix: affix({ className: 'smarthr-ui-Input-suffix' }),
    }
  }, [className])

  const stringValue = typeof value === 'string' ? value : undefined
  const stringDefaultValue = typeof defaultValue === 'string' ? defaultValue : undefined

  const [isInputFocused, setIsInputFocused] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const [inputRect, setInputRect] = useState<DOMRect | null>(null)
  const calendarId = useId()

  const [selectedDate, setSelectedDate] = useState<Date | null>(() =>
    stringToDate(stringValue !== undefined ? stringValue : stringDefaultValue),
  )

  const [alternativeFormat, setAlternativeFormat] = useState<string | null>(() =>
    selectedDate ? formatWarekiDate(selectedDate, locale) : null,
  )

  const [initialInputValue] = useState<string | undefined>(() => {
    if (stringValue !== undefined || stringDefaultValue === undefined) {
      return undefined
    }

    return selectedDate ? dateToIsoString(selectedDate) : stringDefaultValue
  })

  const isCalendarShown = !!inputRect
  const fromDate = min ? (stringToDate(String(min)) ?? DEFAULT_FROM) : DEFAULT_FROM
  const toDate = max ? (stringToDate(String(max)) ?? DEFAULT_TO) : DEFAULT_TO

  const closeFrame = useAnimationFrame()

  const latest = useLatest({
    onChange,
    onBlur,
    isInputFocused,
    selectedDate,
    closeFrame,
    locale,
  })

  const functions = useMemo(() => {
    let inputNode: HTMLInputElement | null = null
    let calendarNode: HTMLElement | null = null

    const updateDate = (e: ChangeLikeEvent, newDate: Date | null) => {
      if (
        !inputNode ||
        newDate === latest.selectedDate ||
        (newDate && latest.selectedDate && newDate.getTime() === latest.selectedDate.getTime())
      ) {
        // 日付に変化が無い場合は何もしない
        return
      }

      const isValid = !newDate || dayjs(newDate).isValid()
      const nextDate = isValid ? newDate : null
      const formatValue = dateToIsoString(nextDate)

      inputNode.value = formatValue
      setAlternativeFormat(nextDate ? formatWarekiDate(nextDate, latest.locale) : null)
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
        )
      }
    }

    const closeCalendar = () => setInputRect(null)

    const openCalendar = () => {
      if (wrapperRef.current) {
        setInputRect(wrapperRef.current.getBoundingClientRect())
      }
    }

    return {
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
              // move focus from Input to previous elements
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
            // move focus from Calendar to next elements
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

          e.currentTarget.querySelector<HTMLInputElement>('[data-smarthr-ui-input="true"]')?.focus()
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
      if (!node || stringValue === undefined) {
        return
      }

      // フォーカス中、またはパース不能な値の場合は上書きフォーマットしない
      if (!isInputFocused) {
        const newDate = stringToDate(stringValue)

        if (newDate && dayjs(newDate).isValid()) {
          node.value = dateToIsoString(newDate)
          setAlternativeFormat(formatWarekiDate(newDate, latest.locale))
          setSelectedDate(newDate)

          return
        }

        setSelectedDate(null)
      }

      node.value = stringValue || ''
    },
    [stringValue, isInputFocused, latest],
  )

  const autoFocusCallbackRef = useOnce((node: HTMLInputElement | null) => {
    if (node && autoFocus) {
      node.focus()
    }
  })

  const mergedRef = useMergeRefs(
    autoFocusCallbackRef,
    functions.inputCallbackRef,
    inputLayoutEffectRef,
    ref,
  )

  const mergedCalendarRef = useMergeRefs(
    useAreaClickCallbackRef(isCalendarShown ? [wrapperRef] : null, functions.closeCalendar),
    functions.calendarCallbackRef,
  )

  const caretIconColor =
    isInputFocused || isCalendarShown
      ? theme.textColor.black
      : disabled
        ? theme.textColor.disabled
        : theme.textColor.grey

  const styleColor = bgColor ? theme.backgroundColor[backgroundColor[bgColor]] : undefined
  const styleMaxWidth = typeof width === 'number' ? `${width}px` : width
  const errorAttr = error || undefined

  return (
    // eslint-disable-next-line smarthr/best-practice-for-interactive-element
    <span
      ref={wrapperRef}
      role="presentation"
      className={classNames.wrapper}
      style={{
        borderColor: styleColor,
        backgroundColor: styleColor,
        maxWidth: styleMaxWidth,
        width: styleMaxWidth ? '100%' : undefined,
      }}
      onClick={(delegateEvent: MouseEvent<HTMLSpanElement>) => {
        delegateEvent.currentTarget
          .querySelector<HTMLInputElement>('[data-smarthr-ui-input="true"]')
          ?.focus()
      }}
      onKeyDown={isCalendarShown ? functions.handleDelegateKeyDown : undefined}
    >
      {prefix && <span className={classNames.prefix}>{prefix}</span>}
      {/* HINT: DatePicker/WarekiPickerと同じ「textbox+ポップアップ」パターン。
          role=comboboxへの完全準拠(aria-activedescendant等)はしていないため、aria-expanded等の警告を抑止する */}
      {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
      <input
        {...rest}
        ref={mergedRef}
        disabled={disabled}
        defaultValue={initialInputValue}
        className={classNames.input}
        aria-invalid={errorAttr}
        aria-expanded={isCalendarShown}
        aria-controls={calendarId}
        aria-haspopup={true}
        data-smarthr-ui-input-error={errorAttr}
        data-smarthr-ui-input="true"
        onChange={isCalendarShown ? functions.closeCalendar : undefined}
        onKeyPress={functions.handleKeyPressInput}
        onFocus={functions.handleFocusInput}
        onBlur={functions.handleBlur}
      />
      <CalendarValueSuffix alternativeFormat={alternativeFormat} caretIconColor={caretIconColor} />
      {inputRect && (
        <CalendarPortal inputRect={inputRect}>
          <Calendar
            ref={mergedCalendarRef}
            id={calendarId}
            value={selectedDate || undefined}
            from={fromDate}
            to={toDate}
            onSelectDate={functions.handleSelectDateCalendar}
          />
        </CalendarPortal>
      )}
    </span>
  )
}
