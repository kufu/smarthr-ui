import React, { FC, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { ResetButton } from './ResetButton'

type Props = {
  selectedYear?: number
  fromYear: number
  toYear: number
  onSelectYear: (year: number) => void
}

export const YearPicker: FC<Props> = ({ selectedYear, fromYear, toYear, onSelectYear }) => {
  const themes = useTheme()
  const scrollingRef = useRef<HTMLDivElement>(null)

  const thisYear = new Date().getFullYear()
  const numOfYear = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0)
  const yearArray = Array(numOfYear)
    .fill(null)
    .map((_, i) => fromYear + i)

  useEffect(() => {
    if (scrollingRef.current) {
      scrollingRef.current.scrollIntoView({ block: 'center' })
    }
  }, [])

  return (
    <Container>
      {yearArray.map((year) => {
        const isThisYear = thisYear === year
        const isSelectedYear = selectedYear === year
        return (
          <YearButton
            key={year}
            themes={themes}
            onClick={() => onSelectYear(year)}
            aria-pressed={isSelectedYear}
          >
            <YearWrapper
              themes={themes}
              isThisYear={isThisYear}
              isSelected={isSelectedYear}
              ref={isThisYear ? scrollingRef : null}
            >
              {year}
            </YearWrapper>
          </YearButton>
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  padding: 8px 3px;
  box-sizing: border-box;
  overflow-y: scroll;
`
const YearWrapper = styled.div<{ themes: Theme; isThisYear?: boolean; isSelected?: boolean }>(
  ({ themes, isThisYear, isSelected }) => {
    const { palette, size } = themes
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 51px;
      height: 27px;
      border-radius: 14px;
      font-size: ${size.pxToRem(size.font.TALL)};
      box-sizing: border-box;
      line-height: 0;
      ${isThisYear &&
      css`
        border: solid 1px ${palette.BORDER};
      `};
      ${isSelected &&
      css`
        color: #fff !important;
        background-color: ${palette.MAIN} !important;
      `}
    `
  },
)
const YearButton = styled(ResetButton)<{ themes: Theme }>`
  width: 25%;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    ${YearWrapper} {
      color: ${(props) => props.themes.palette.TEXT_BLACK};
      background-color: #f5f5f5;
    }
  }
`
