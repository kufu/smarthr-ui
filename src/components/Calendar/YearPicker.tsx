import React, { FC, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

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
      <Grid>
        {yearArray.map((year) => {
          const isThisYear = thisYear === year
          return (
            <Cell key={year} themes={themes} onClick={() => onSelectYear(year)}>
              <YearWrapper
                themes={themes}
                isThisYear={isThisYear}
                isSelected={selectedYear === year}
                ref={isThisYear ? scrollingRef : null}
              >
                {year}
              </YearWrapper>
            </Cell>
          )
        })}
      </Grid>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 2.5px;
  box-sizing: border-box;
  overflow-y: auto;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
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
      border-radius: 13.5px;
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
const Cell = styled.button<{ themes: Theme }>`
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: inherit;
  font-size: 100%;
  font-family: inherit;
  cursor: pointer;
  &:hover {
    ${YearWrapper} {
      color: ${(props) => props.themes.palette.TEXT_BLACK};
      background-color: #f5f5f5;
    }
  }
`
