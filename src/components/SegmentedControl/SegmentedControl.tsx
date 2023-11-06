import React, {
  HTMLAttributes,
  ReactNode,
  VFC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'

import { useClassNames } from './useClassNames'

export type Option = {
  /** 選択時に返される値 */
  value: string
  /** ボタンに表示する内容 */
  content: ReactNode
  /** ボタンの `aria-label` */
  ariaLabel?: string
  /** ボタンを disabled にするかどうか */
  disabled?: boolean
}

type Props = {
  /** 選択肢の配列 */
  options: Option[]
  /** 選択中の値 */
  value?: string | null
  /** 選択肢を押下したときに発火するコールバック関数 */
  onClickOption?: (value: string) => void
  /** 各ボタンの大きさ */
  size?: 'default' | 's'
  /** 各ボタンを正方形にするかどうか。アイコンボタンを使用する場合に指定します。 */
  isSquare?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const SegmentedControl: VFC<Props & ElementProps> = ({
  options,
  value,
  onClickOption,
  size = 'default',
  isSquare = false,
  className = '',
  ...props
}) => {
  const themes = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isFocused || !containerRef.current || !document.activeElement) {
        return
      }
      const radios = Array.from(
        containerRef.current.querySelectorAll('[role="radio"]:not(:disabled)'),
      )
      if (radios.length < 2) {
        return
      }
      const focusedIndex = radios.indexOf(document.activeElement)
      if (focusedIndex === -1) {
        return
      }
      switch (e.key) {
        case 'Down':
        case 'ArrowDown':
        case 'Right':
        case 'ArrowRight': {
          const nextIndex = focusedIndex + 1
          const nextRadio = radios[nextIndex % radios.length]
          if (nextRadio instanceof HTMLButtonElement) {
            nextRadio.focus()
          }
          break
        }
        case 'Up':
        case 'ArrowUp':
        case 'Left':
        case 'ArrowLeft': {
          const nextIndex = focusedIndex - 1
          const nextRadio = radios[(nextIndex + radios.length) % radios.length]
          if (nextRadio instanceof HTMLButtonElement) {
            nextRadio.focus()
          }
          break
        }
      }
    },
    [isFocused],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const includesSelected = value && options.some((option) => option.value === value)
  const getRovingTabIndex = useCallback(
    (option: Option, index: number) => {
      if (isFocused) {
        return -1
      }
      if (!includesSelected) {
        return index === 0 ? 0 : -1
      }
      return option.value === value ? 0 : -1
    },
    [includesSelected, isFocused, value],
  )

  const classNames = useClassNames()

  return (
    <Container
      {...props}
      className={`${className} ${classNames.wrapper}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      ref={containerRef}
      role="toolbar"
    >
      <div role="radiogroup">
        {options.map((option, i) => {
          const isSelected = !!value && value === option.value
          const onClick = onClickOption ? () => onClickOption(option.value) : undefined
          return (
            <StyledButton
              aria-label={option.ariaLabel}
              key={option.value}
              disabled={option.disabled}
              onClick={onClick}
              size={size}
              square={isSquare}
              themes={themes}
              tabIndex={getRovingTabIndex(option, i)}
              role="radio"
              aria-checked={isSelected}
              className={classNames.button}
            >
              {option.content}
            </StyledButton>
          )
        })}
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: inline-flex;
`
const StyledButton = styled(Button)<{ themes: Theme }>(
  ({ themes: { border, color, radius, shadow } }) => css`
    margin: 0;
    border-radius: 0;

    &[aria-checked='true'] {
      border-color: ${color.MAIN};
      background-color: ${color.MAIN};
      color: ${color.TEXT_WHITE};
      &.hover {
        border-color: ${color.hoverColor(color.MAIN)};
        background-color: ${color.hoverColor(color.MAIN)};
      }
    }

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
    &:first-child {
      border-top-left-radius: ${radius.m};
      border-bottom-left-radius: ${radius.m};
    }
    &:last-child {
      border-top-right-radius: ${radius.m};
      border-bottom-right-radius: ${radius.m};
    }
    & + & {
      margin-left: -${border.lineWidth};
    }
  `,
)
