import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Dropdown } from '../Dropdown'
import { DropdownTrigger } from '../DropdownTrigger'
import { DropdownContent } from '../DropdownContent'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { PrimaryButton, SecondaryButton, TextButton } from '../../Button'
import { FaCaretDownIcon, FaUndoAltIcon } from '../../Icon'

type Props = {
  isFiltered?: boolean
  onApply: () => void
  onCancel?: () => void
  onReset?: () => void
  children: ReactNode
}

export const FilterDropdown: FC<Props> = ({
  isFiltered = false,
  onApply,
  onCancel,
  onReset,
  children,
}: Props) => {
  const themes = useTheme()

  return (
    <Dropdown>
      <TriggerButtonWrapper themes={themes} isFiltered={isFiltered}>
        <DropdownTrigger>
          <SecondaryButton suffix={<FaCaretDownIcon />}>絞り込み</SecondaryButton>
        </DropdownTrigger>
      </TriggerButtonWrapper>
      <DropdownContent controllable>
        <DropdownScrollArea>
          <ContentLayout>{children}</ContentLayout>
        </DropdownScrollArea>
        <BottomLayout themes={themes}>
          {onReset && (
            <ResetButtonLayout>
              <TextButton size="s" prefix={<FaUndoAltIcon />} onClick={() => onReset()}>
                絞り込み条件を解除
              </TextButton>
            </ResetButtonLayout>
          )}
          <RightButtonLayout>
            <DropdownCloser>
              <SecondaryButton onClick={() => onCancel?.()}>キャンセル</SecondaryButton>
            </DropdownCloser>
            <DropdownCloser>
              <PrimaryButton onClick={() => onApply()}>適用</PrimaryButton>
            </DropdownCloser>
          </RightButtonLayout>
        </BottomLayout>
      </DropdownContent>
    </Dropdown>
  )
}

const TriggerButtonWrapper = styled.div<{ themes: Theme; isFiltered: boolean }>`
  ${({ themes, isFiltered }) =>
    isFiltered &&
    css`
      button {
        border-color: ${themes.palette.WARNING};
      }
    `}
`

const ContentLayout = styled.div`
  padding: 24px;
`
const BottomLayout = styled.div<{ themes: Theme }>`
  display: flex;
  align-items: center;
  border-top: 1px solid ${({ themes }) => themes.palette.BORDER};
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
