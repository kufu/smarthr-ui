import React, { ReactNode, VFC } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Dropdown } from '../Dropdown'
import { DropdownTrigger } from '../DropdownTrigger'
import { DropdownContent } from '../DropdownContent'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { PrimaryButton, SecondaryButton, TextButton } from '../../Button'
import { FaCheckCircleIcon, FaFilterIcon, FaUndoAltIcon } from '../../Icon'

type Props = {
  isFiltered?: boolean
  onApply: () => void
  onCancel?: () => void
  onReset?: () => void
  children: ReactNode
  hasStatusText?: boolean
}

export const FilterDropdown: VFC<Props> = ({
  isFiltered = false,
  onApply,
  onCancel,
  onReset,
  children,
  hasStatusText,
}: Props) => {
  const themes = useTheme()

  return (
    <Dropdown>
      <DropdownTrigger>
        <>
          <SecondaryButton
            suffix={
              <IsFilteredIconWrapper isFiltered={isFiltered} themes={themes}>
                <FaFilterIcon size={13} />
                {isFiltered ? (
                  <FaCheckCircleIcon size={8} aria-label={hasStatusText ? undefined : '適用中'} />
                ) : null}
              </IsFilteredIconWrapper>
            }
          >
            絞り込み
          </SecondaryButton>
          {hasStatusText && isFiltered ? <StatusText themes={themes}>適用中</StatusText> : null}
        </>
      </DropdownTrigger>
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
  font-size: ${({ themes }) => themes.size.pxToRem(themes.fontSize.SHORT)};
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
