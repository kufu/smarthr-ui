import React, { HTMLAttributes, VFC, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'
import { UnstyledButton } from '../Button'

type Props = {
  /** 選択された年 */
  selectedYear?: number
  /** 選択可能な開始年 */
  fromYear: number
  /** 選択可能な終了年 */
  toYear: number
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectYear: (year: number) => void
  /** 表示フラグ */
  isDisplayed: boolean
  /** HTMLのid属性 */
  id: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const YearPicker: VFC<Props & ElementProps> = ({
  selectedYear,
  fromYear,
  toYear,
  onSelectYear,
  isDisplayed,
  id,
  ...props
}) => {
  const themes = useTheme()
  const classNames = useClassNames()
  const focusingRef = useRef<HTMLButtonElement>(null)

  const thisYear = new Date().getFullYear()
  const numOfYear = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0)
  const yearArray = Array(numOfYear)
    .fill(null)
    .map((_, i) => fromYear + i)

  useEffect(() => {
    if (focusingRef.current && isDisplayed) {
      focusingRef.current.focus()
      focusingRef.current.blur()
    }
  }, [isDisplayed])

  return (
    <Overlay
      {...props}
      themes={themes}
      isDisplayed={isDisplayed}
      id={id}
      className={`${props.className} ${classNames.yearPicker.wrapper}`}
    >
      <Container themes={themes}>
        {yearArray.map((year) => {
          const isThisYear = thisYear === year
          const isSelectedYear = selectedYear === year
          return (
            <YearButton
              key={year}
              themes={themes}
              onClick={() => onSelectYear(year)}
              aria-pressed={isSelectedYear}
              ref={isThisYear ? focusingRef : null}
              className={classNames.yearPicker.selectYear}
            >
              <YearWrapper themes={themes} isThisYear={isThisYear} isSelected={isSelectedYear}>
                {year}
              </YearWrapper>
            </YearButton>
          )
        })}
      </Container>
    </Overlay>
  )
}

const Overlay = styled.div<{ themes: Theme; isDisplayed: boolean }>`
  ${({ isDisplayed }) =>
    !isDisplayed &&
    css`
      display: none;
    `}
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ themes }) => themes.color.WHITE};
`

const Container = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    padding: ${spacingByChar(0.5)} ${spacingByChar(0.25)};
    box-sizing: border-box;
    overflow-y: auto;
  `}
`
const YearWrapper = styled.span<{ themes: Theme; isThisYear?: boolean; isSelected?: boolean }>(
  ({ themes, isThisYear, isSelected }) => {
    const { border, color, fontSize, leading, spacingByChar } = themes
    return css`
      display: inline-block;
      padding: ${spacingByChar(0.5)} ${spacingByChar(0.75)};
      border-radius: 2rem;
      font-size: ${fontSize.M};
      box-sizing: border-box;
      line-height: ${leading.NONE};
      ${isThisYear &&
      css`
        border: ${border.shorthand};
      `};
      ${isSelected &&
      css`
        color: ${color.TEXT_WHITE} !important;
        background-color: ${color.MAIN} !important;
      `}
    `
  },
)
const YearButton = styled(UnstyledButton)<{ themes: Theme }>`
  ${({ themes: { color, leading, spacingByChar } }) => css`
    width: 25%;
    padding: ${spacingByChar(0.5)} 0;
    line-height: ${leading.NONE};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      ${YearWrapper} {
        color: ${color.TEXT_BLACK};
        background-color: ${color.BASE_GREY};
      }
    }
  `}
`
