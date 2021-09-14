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
import { useClassNames } from './useClassNames'
import { SecondaryButton } from '../Button'

export type Option = {
  value: string
  content: ReactNode
  ariaLabel?: string
  disabled?: boolean
}

type Props = {
  options: Option[]
  value?: string | null
  onClickOption?: (value: string) => void
  size?: 'default' | 's'
  isSquare?: boolean
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
            <Button
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
            </Button>
          )
        })}
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: inline-flex;
`
const Button = styled(SecondaryButton)<{ themes: Theme }>(({ themes }) => {
  const { color, border, radius, shadow } = themes
  return css`
    border: ${border.shorthand};
    border-radius: 0;

    &[aria-checked='true'] {
      color: ${color.TEXT_WHITE};
      background-color: ${color.MAIN};
      border: ${border.lineWidth} ${border.lineStyle} ${color.MAIN};
      border-left: ${border.lineWidth} ${border.lineStyle} transparent;
      &.hover {
        background-color: ${color.hoverColor(color.MAIN)};
        border-color: ${color.hoverColor(color.MAIN)};
      }
    }

    &:focus {
      ${shadow.focusIndicatorStyles}
    }

    /* active時、buttonの両端にborder.defaultが表示されることを防ぐための処置 */
    &[aria-checked='true'] + & {
      border-right-width: 0;
      &:last-child {
        border-right-width: ${border.lineWidth};
      }
    }
    &:first-child {
      border-top-left-radius: ${radius.m};
      border-bottom-left-radius: ${radius.m};
    }
    &:last-child {
      border-top-right-radius: ${radius.m};
      border-bottom-right-radius: ${radius.m};
    }
    :not(:last-child) {
      border-right-width: 0;
    }
  `
})
