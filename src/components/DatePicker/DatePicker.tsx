import React, { VFC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useOuterClick } from '../../hooks/useOuterClick'
import { useGlobalKeyDown } from './useGlobalKeyDown'
import { parseJpnDateString } from './datePickerHelper'
import { useClassNames } from './useClassNames'

import { Input } from '../Input'
import { FaCalendarAltIcon } from '../Icon'
import { Calendar } from '../Calendar'
import { Portal } from './Portal'
import { useId } from '../../hooks/useId'

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
  /** フォームにエラーがあるかどうか */
  error?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** 入力を独自にパースする場合に、パース処理を記述する関数 */
  parseInput?: (input: string) => Date | null
  /** 表示する日付を独自にフォーマットする場合に、フォーマット処理を記述する関数 */
  formatDate?: (date: Date | null) => string
  /** 入出力用文字列と併記する形で用いる別フォーマットの日付 */
  alternativeFormattedDate?: string
  /** 選択された日付が変わった時に発火するコールバック関数 */
  onChangeDate?: (date: Date | null, value: string) => void
}
type InputAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof Props>

export const DatePicker: VFC<Props & InputAttributes> = ({
  value,
  name,
  from,
  to,
  disabled,
  error,
  className = '',
  parseInput,
  formatDate,
  alternativeFormattedDate,
  onChangeDate,
  ...inputAttrs
}) => {
  const stringToDate = useCallback(
    (str?: string | null) => {
      if (!str) {
        return null
      }
      return parseInput ? parseInput(str) : parseJpnDateString(str)
    },
    [parseInput],
  )

  const dateToString = useCallback(
    (_date: Date | null) => {
      if (formatDate) {
        return formatDate(_date)
      }
      if (!_date) {
        return ''
      }
      return dayjs(_date).format('YYYY/MM/DD')
    },
    [formatDate],
  )

  const themes = useTheme()
  const [selectedDate, setSelectedDate] = useState<Date | null>(stringToDate(value))
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const calendarPortalRef = useRef<HTMLDivElement>(null)
  const [inputRect, setInputRect] = useState<DOMRect | null>(null)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isCalendarShown, setIsCalendarShown] = useState(false)
  const calenderId = useId()

  const updateDate = useCallback(
    (newDate: Date | null) => {
      if (
        newDate === selectedDate ||
        (newDate && selectedDate && newDate.getTime() === selectedDate.getTime())
      ) {
        // Do not update date if the new date is same with the old one.
        return
      }
      if (!inputRef.current) {
        return
      }

      // Do not change input value if new date is invalid date
      if (!newDate || dayjs(newDate).isValid()) {
        inputRef.current.value = dateToString(newDate)
      }
      setSelectedDate(newDate)
      onChangeDate && onChangeDate(newDate, inputRef.current.value)
    },
    [selectedDate, dateToString, onChangeDate],
  )

  const switchCalendarVisibility = useCallback((isVisible: boolean) => {
    if (!isVisible) {
      setIsCalendarShown(false)
      return
    }
    if (!inputWrapperRef.current) {
      return
    }
    setIsCalendarShown(true)
    setInputRect(inputWrapperRef.current.getBoundingClientRect())
  }, [])

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
        setSelectedDate(newDate)
        return
      }
      setSelectedDate(null)
    }
    inputRef.current.value = value || ''
  }, [value, isInputFocused, dateToString, stringToDate])

  useOuterClick(
    [inputWrapperRef, calendarPortalRef],
    useCallback(() => {
      switchCalendarVisibility(false)
    }, [switchCalendarVisibility]),
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !inputRef.current || !calendarPortalRef.current) {
        return
      }
      const calendarButtons = calendarPortalRef.current.querySelectorAll('button')
      if (calendarButtons.length === 0) {
        return
      }
      const firstCalendarButton = calendarButtons[0]
      const lastCalendarButton = calendarButtons[calendarButtons.length - 1]
      if (isInputFocused) {
        if (e.shiftKey) {
          // move focus from Input to previous elements of DatePicker
          switchCalendarVisibility(false)
          return
        }
        // move focus from Input to Calendar
        e.preventDefault()
        firstCalendarButton.focus()
        return
      }
      const currentFocused = Array.from(calendarButtons).find((button) => button === e.target)
      if (e.shiftKey && currentFocused === firstCalendarButton) {
        // move focus from Calendar to Input
        inputRef.current.focus()
        e.preventDefault()
      } else if (!e.shiftKey && currentFocused === lastCalendarButton) {
        // move focus from Calendar to next elements of DatePicker
        inputRef.current.focus()
        switchCalendarVisibility(false)
      }
    },
    [isInputFocused, switchCalendarVisibility],
  )
  useGlobalKeyDown(handleKeyDown)

  const caretIconColor = useMemo(() => {
    if (isInputFocused || isCalendarShown) return themes.color.TEXT_BLACK
    if (disabled) return themes.color.TEXT_DISABLED
    return themes.color.TEXT_GREY
  }, [isCalendarShown, isInputFocused, disabled, themes])

  const classNames = useClassNames()

  return (
    <Container
      className={`${className} ${classNames.wrapper}`}
      onClick={() => {
        if (!disabled && !isCalendarShown) {
          switchCalendarVisibility(true)
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Escape' || e.key === 'Esc') && isCalendarShown) {
          e.stopPropagation()
          requestAnimationFrame(() => {
            // delay hiding calendar because calendar will be displayed when input is focused
            switchCalendarVisibility(false)
          })
          inputRef.current && inputRef.current.focus()
        }
      }}
    >
      <InputWrapper ref={inputWrapperRef}>
        <StyledInput
          {...inputAttrs}
          type="text"
          name={name}
          onChange={() => {
            if (isCalendarShown) {
              switchCalendarVisibility(false)
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              switchCalendarVisibility(!isCalendarShown)
            }
          }}
          onFocus={() => {
            setIsInputFocused(true)
            switchCalendarVisibility(true)
          }}
          onBlur={(e) => {
            setIsInputFocused(false)
            const inputString = e.target.value
            if (inputString === '') {
              updateDate(null)
              return
            }
            const newDate = parseInput ? parseInput(inputString) : parseJpnDateString(inputString)
            updateDate(newDate)
          }}
          suffix={
            <CalendarIconLayout themes={themes}>
              <CalendarIconWrapper themes={themes}>
                <FaCalendarAltIcon color={caretIconColor} />
              </CalendarIconWrapper>
            </CalendarIconLayout>
          }
          disabled={disabled}
          error={error}
          ref={inputRef}
          className={classNames.inputContainer}
          aria-expanded={isCalendarShown}
          aria-controls={calenderId}
          aria-haspopup={true}
        />
        {alternativeFormattedDate && (
          <OverlayText themes={themes}>{alternativeFormattedDate}</OverlayText>
        )}
      </InputWrapper>
      {isCalendarShown && inputRect && (
        <Portal inputRect={inputRect} ref={calendarPortalRef}>
          <Calendar
            id={calenderId}
            value={selectedDate || undefined}
            from={from}
            to={to}
            onSelectDate={(_, selected) => {
              updateDate(selected)
              requestAnimationFrame(() => {
                // delay hiding calendar because calendar will be displayed when input is focused
                switchCalendarVisibility(false)
              })
              inputRef.current && inputRef.current.focus()
            }}
          />
        </Portal>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
`
const InputWrapper = styled.div`
  position: relative;
`
const StyledInput = styled(Input)`
  width: 100%;
`
const CalendarIconLayout = styled.span<{ themes: Theme }>(({ themes: { spacingByChar } }) => {
  return css`
    height: 100%;
    padding: ${spacingByChar(0.5)} 0;
    box-sizing: border-box;
  `
})
const CalendarIconWrapper = styled.span<{ themes: Theme }>(({ themes }) => {
  const { fontSize, color, spacingByChar } = themes
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 100%;
    padding-left: ${spacingByChar(0.5)};
    border-left: 1px solid ${color.BORDER};
    font-size: ${fontSize.M};
  `
})

const OverlayText = styled.span<{ themes: Theme }>(({ themes }) => {
  const { fontSize, color, spacingByChar } = themes
  return css`
    position: absolute;
    right: ${spacingByChar(2.5)};
    top: 50%;
    transform: translateY(-50%);
    color: ${color.TEXT_GREY};
    font-size: ${fontSize.S};
  `
})
