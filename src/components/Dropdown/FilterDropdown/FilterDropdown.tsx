import React, { ReactNode, VFC } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Dropdown } from '../Dropdown'
import { DropdownTrigger } from '../DropdownTrigger'
import { DropdownContent } from '../DropdownContent'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { Button } from '../../Button'
import { FaCheckCircleIcon, FaFilterIcon, FaUndoAltIcon } from '../../Icon'

type Props = {
  isFiltered?: boolean
  onApply: () => void
  onCancel?: () => void
  onReset?: () => void
  children: ReactNode
  hasStatusText?: boolean
  statusText?: string
  statusTextDecorator?: (statusTextNode: ReactNode) => ReactNode
  filterButtonText?: ReactNode
  applyButtonText?: ReactNode
  cancelButtonText?: ReactNode
  resetButtonText?: ReactNode
}

export const FilterDropdown: VFC<Props> = ({
  isFiltered = false,
  onApply,
  onCancel,
  onReset,
  children,
  hasStatusText,
  statusText = '適用中',
  statusTextDecorator,
  filterButtonText = '絞り込み',
  applyButtonText = '適用',
  cancelButtonText = 'キャンセル',
  resetButtonText = '絞り込み条件を解除',
}: Props) => {
  const themes = useTheme()

  const FilteredIcon = (text: string) => (
    <IsFilteredIconWrapper isFiltered={isFiltered} themes={themes}>
      <FaFilterIcon />
      {isFiltered ? (
        <FaCheckCircleIcon size={8} aria-label={hasStatusText ? undefined : text} />
      ) : null}
    </IsFilteredIconWrapper>
  )

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          suffix={
            statusTextDecorator
              ? statusTextDecorator(FilteredIcon(statusText))
              : FilteredIcon(statusText)
          }
        >
          {filterButtonText}
        </Button>
      </DropdownTrigger>
      {hasStatusText && isFiltered ? (
        <StatusText themes={themes}>
          {statusTextDecorator ? statusTextDecorator(statusText) : statusText}
        </StatusText>
      ) : null}
      <DropdownContent controllable>
        <DropdownScrollArea>
          <ContentLayout>{children}</ContentLayout>
        </DropdownScrollArea>
        <BottomLayout themes={themes}>
          {onReset && (
            <ResetButtonLayout>
              <Button variant="text" size="s" prefix={<FaUndoAltIcon />} onClick={() => onReset()}>
                {resetButtonText}
              </Button>
            </ResetButtonLayout>
          )}
          <RightButtonLayout>
            <DropdownCloser>
              <Button onClick={() => onCancel?.()}>{cancelButtonText}</Button>
            </DropdownCloser>
            <DropdownCloser>
              <Button value="primary" onClick={() => onApply()}>
                {applyButtonText}
              </Button>
            </DropdownCloser>
          </RightButtonLayout>
        </BottomLayout>
      </DropdownContent>
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
const ContentLayout = styled.div`
  padding: 24px;
`
const BottomLayout = styled.div<{ themes: Theme }>`
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ themes }) => themes.color.BORDER};
  padding: 16px 24px;
`
const ResetButtonLayout = styled.div`
  margin-left: -8px;
`
const RightButtonLayout = styled.div`
  display: flex;
  margin-left: auto;
  & > *:not(:first-child) {
    margin-left: 16px;
  }
`
