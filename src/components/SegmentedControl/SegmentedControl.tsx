import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { PrimaryButton, SecondaryButton } from '../Button'

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
}) => {
  const themes = useTheme()

  return (
    <Container className={className}>
      {options.map((option) => {
        const isSelected = !!value && value === option.value
        const Button = isSelected ? SelectedButton : DefaultButton
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
          >
            {option.content}
          </Button>
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  display: inline-flex;
`
const buttonStyle = css<{ themes: Theme }>(({ themes }) => {
  const { border } = themes.frame
  return css`
    border: ${border.default};
    border-radius: 0;

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
const DefaultButton = styled(SecondaryButton)<{ themes: Theme }>`
  ${buttonStyle}
`
const SelectedButton = styled(PrimaryButton)<{ themes: Theme }>`
  ${buttonStyle}
`
