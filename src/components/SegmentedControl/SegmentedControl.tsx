import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
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

export const SegmentedControl: FC<Props> = ({
  options,
  value,
  onClickOption,
  size = 'default',
  isSquare = false,
  className,
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

  return (
    <Container
      {...props}
      className={className}
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
  const { palette, frame } = themes
  const { border } = frame
  return css`
    border: ${border.default};
    border-radius: 0;

    &[aria-checked='true'] {
      color: #fff;
      background-color: ${palette.MAIN};
      &.hover {
        background-color: ${palette.hoverColor(palette.MAIN)};
      }
    }
    &:first-child {
      border-top-left-radius: ${border.radius.m};
      border-bottom-left-radius: ${border.radius.m};
    }
    &:last-child {
      border-top-right-radius: ${border.radius.m};
      border-bottom-right-radius: ${border.radius.m};
    }
    :not(:last-child) {
      border-right-width: 0;
    }
  `
})
