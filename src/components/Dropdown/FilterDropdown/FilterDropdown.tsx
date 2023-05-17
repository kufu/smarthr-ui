import React, { ButtonHTMLAttributes, FC, ReactNode, useMemo } from 'react'
import innerText from 'react-innertext'
import styled from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { DecoratorType, DecoratorsType, ResponseMessageType } from '../../../types/props'
import { Button } from '../../Button'
import { FaCheckCircleIcon, FaFilterIcon } from '../../Icon'
import { Dropdown } from '../Dropdown'
import { DropdownTrigger } from '../DropdownTrigger'

import { FilterDropdownContent } from './FillterDropdownContent'

type Props = {
  isFiltered?: boolean
  onApply: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void) => void
  onCancel?: React.MouseEventHandler<HTMLButtonElement>
  onReset?: React.MouseEventHandler<HTMLButtonElement>
  children: ReactNode
  hasStatusText?: boolean
  decorators?: DecoratorsType<
    'status' | 'triggerButton' | 'applyButton' | 'cancelButton' | 'resetButton'
  >
  responseMessage?: ResponseMessageType
}
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props>

const STATUS_FILTERED_TEXT = '適用中'
const TRIGGER_BUTTON_TEXT = '絞り込み'

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

export const FilterDropdown: FC<Props & ElementProps> = ({
  isFiltered = false,
  onApply,
  onCancel,
  onReset,
  children,
  hasStatusText,
  decorators,
  responseMessage,
  ...props
}: Props) => {
  const themes = useTheme()
  const status: ReactNode = useMemo(
    () => executeDecorator(STATUS_FILTERED_TEXT, decorators?.status),
    [decorators],
  )
  const triggerButton: ReactNode = useMemo(
    () => executeDecorator(TRIGGER_BUTTON_TEXT, decorators?.triggerButton),
    [decorators],
  )
  const filteredIconAriaLabel = useMemo(
    () => (hasStatusText ? undefined : innerText(status)),
    [status, hasStatusText],
  )

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          {...props}
          suffix={
            <IsFilteredIconWrapper isFiltered={isFiltered} themes={themes}>
              <FaFilterIcon />
              {isFiltered ? (
                <FaCheckCircleIcon size={8} aria-label={filteredIconAriaLabel} />
              ) : null}
            </IsFilteredIconWrapper>
          }
        >
          {triggerButton}
        </Button>
      </DropdownTrigger>
      {hasStatusText && isFiltered ? <StatusText themes={themes}>{status}</StatusText> : null}
      <FilterDropdownContent
        decorators={decorators}
        responseMessage={responseMessage}
        onApply={onApply}
        onCancel={onCancel}
        onReset={onReset}
      >
        {children}
      </FilterDropdownContent>
    </Dropdown>
  )
}

const IsFilteredIconWrapper = styled.span<{ isFiltered: boolean; themes: Theme }>`
  position: relative;
  color: ${({ isFiltered, themes }) => {
    return isFiltered ? themes.color.MAIN : themes.color.TEXT_BLACK
  }};
  line-height: 1;

  & > [role='img'] + [role='img'] {
    position: absolute;
    right: -4px;
    bottom: 2px;
  }
`
const StatusText = styled.span<{ themes: Theme }>`
  margin-left: ${({ themes }) => themes.spacing.XXS};
  font-size: ${({ themes }) => themes.fontSize.S};
`
