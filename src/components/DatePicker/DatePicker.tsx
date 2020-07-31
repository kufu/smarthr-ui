import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Input } from '../Input'
import { Icon } from '../Icon'
import { Calendar } from '../Calendar'
import { Portal } from './Portal'
import { useOuterClick } from './useOuterClick'
import { useGlobalKeyDown } from './useGlobalKeyDown'
import { parseJpnDateString } from './datePickerHelper'

type Props = {
  date?: Date | null
  onChangeDate?: (date: Date | null) => void
  parsingErrorMessage?: string
  parseInput?: (input: string) => Date | null
  formatDate?: (date: Date | null) => string
  className?: string
}

export const DatePicker: FC<Props> = ({
  date = null,
  onChangeDate,
  parsingErrorMessage = '非対応な入力形式です',
  parseInput,
  formatDate,
  className,
}) => {
  const themes = useTheme()
  const [selectedDate, setSelectedDate] = useState<Date | null>(date)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const [calendarPosition, setCalendarPosition] = useState({
    top: 0,
    left: 0,
  })
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [isCalendarShown, setIsCalendarShown] = useState(false)
  const [existsParsingError, setExistsParsingError] = useState(false)

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

  const updateDate = useCallback(
    (newDate: Date | null) => {
      if (newDate && isNaN(newDate.getTime())) {
        setExistsParsingError(true)
        return
      }
      if (
        newDate === selectedDate ||
        (newDate && selectedDate && newDate.getTime() === selectedDate.getTime())
      ) {
        return
      }
      if (!inputRef.current) {
        return
      }
      inputRef.current.value = dateToString(newDate)
      setSelectedDate(newDate)
      setExistsParsingError(false)
      onChangeDate && onChangeDate(newDate)
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
    const rect = inputWrapperRef.current.getBoundingClientRect()
    setCalendarPosition({
      top: rect.top + rect.height,
      left: rect.left,
    })
  }, [])

  useEffect(() => {
    if (date && inputRef.current) {
      inputRef.current.value = dateToString(date)
    }
  }, [date, dateToString])

  useOuterClick(
    [inputWrapperRef.current, calendarRef.current],
    useCallback(() => {
      switchCalendarVisibility(false)
    }, [switchCalendarVisibility]),
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !inputRef.current || !calendarRef.current) {
        return
      }
      const calendarButtons = calendarRef.current.querySelectorAll('button')
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

  const shouldShowError = !isInputFocused && !isCalendarShown && existsParsingError

  return (
    <Container
      className={className}
      onClick={() => {
        if (!isCalendarShown) {
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
          type="text"
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
                <Icon
                  name="fa-calendar-alt"
                  color={
                    isInputFocused || isCalendarShown
                      ? themes.palette.TEXT_BLACK
                      : themes.palette.BORDER
                  }
                />
              </CalendarIconWrapper>
            </CalendarIconLayout>
          }
          error={shouldShowError}
          ref={inputRef}
        />
      </InputWrapper>
      {isCalendarShown && (
        <Portal {...calendarPosition}>
          <Calendar
            value={selectedDate || undefined}
            onSelectDate={(_, selected) => {
              updateDate(selected)
              requestAnimationFrame(() => {
                // delay hiding calendar because calendar will be displayed when input is focused
                switchCalendarVisibility(false)
              })
              inputRef.current && inputRef.current.focus()
            }}
            ref={calendarRef}
          />
        </Portal>
      )}
      {shouldShowError && (
        <Error themes={themes}>
          <ErrorIcon name="fa-exclamation-circle" color={themes.palette.DANGER} />
          <ErrorText>{parsingErrorMessage}</ErrorText>
        </Error>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
`
const InputWrapper = styled.div``
const StyledInput = styled(Input)`
  width: 100%;
`
const CalendarIconLayout = styled.span<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    height: 100%;
    padding: ${size.pxToRem(size.space.XXS)} 0;
    box-sizing: border-box;
  `
})
const CalendarIconWrapper = styled.span<{ themes: Theme }>(({ themes }) => {
  const { palette, size } = themes
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 100%;
    padding-left: ${size.pxToRem(size.space.XXS)};
    border-left: 1px solid ${palette.BORDER};
    font-size: ${size.pxToRem(size.font.TALL)};
  `
})
const Error = styled.div<{ themes: Theme }>(({ themes }) => {
  const { font, pxToRem, space } = themes.size
  return css`
    margin: ${pxToRem(space.XXS)} 0 0 0;
    font-size: ${pxToRem(font.SHORT)};
    line-height: 1;
  `
})
const ErrorIcon = styled(Icon)`
  margin-right: 0.4rem;
  vertical-align: middle;
`
const ErrorText = styled.span`
  vertical-align: middle;
`
