import React, { ReactNode, VFC, useMemo } from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Dropdown } from '../Dropdown'
import { DropdownTrigger } from '../DropdownTrigger'
import { DropdownContent } from '../DropdownContent'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { Button } from '../../Button'
import { FaCheckCircleIcon, FaFilterIcon, FaUndoAltIcon } from '../../Icon'
import innerText from 'react-innertext'

type Props = {
  isFiltered?: boolean
  onApply: () => void
  onCancel?: () => void
  onReset?: () => void
  children: ReactNode
  hasStatusText?: boolean
  decorator?: {
    status?: (text: ReactNode) => ReactNode
    triggerButton?: (text: string) => ReactNode
    applyButton?: (text: string) => ReactNode
    cancelButton?: (text: string) => ReactNode
    resetButton?: (text: string) => ReactNode
  }
}

const STATUS_FILTERD_TEXT = '適用中'
const TRIGGER_BUTTON_TEXT = '絞り込み'
const APPLY_BUTTON_TEXT = '適用'
const CANCEL_BUTTON_TEXT = 'キャンセル'
const RESET_BUTTON_TEXT = '絞り込み条件を解除'

export const FilterDropdown: VFC<Props> = ({
  isFiltered = false,
  onApply,
  onCancel,
  onReset,
  children,
  hasStatusText,
  decorator,
}: Props) => {
  const themes = useTheme()
  const status: ReactNode = useMemo(
    () => (decorator?.status ? decorator.status(STATUS_FILTERD_TEXT) : STATUS_FILTERD_TEXT),
    [decorator],
  )
  const triggerButton: ReactNode = useMemo(
    () =>
      decorator?.triggerButton ? decorator.triggerButton(TRIGGER_BUTTON_TEXT) : TRIGGER_BUTTON_TEXT,
    [decorator],
  )
  const applyButton: ReactNode = useMemo(
    () => (decorator?.applyButton ? decorator.applyButton(APPLY_BUTTON_TEXT) : APPLY_BUTTON_TEXT),
    [decorator],
  )
  const cancelButton: ReactNode = useMemo(
    () =>
      decorator?.cancelButton ? decorator.cancelButton(CANCEL_BUTTON_TEXT) : CANCEL_BUTTON_TEXT,
    [decorator],
  )
  const resetButton: ReactNode = useMemo(
    () => (decorator?.resetButton ? decorator.resetButton(RESET_BUTTON_TEXT) : RESET_BUTTON_TEXT),
    [decorator],
  )
  // TODO: iconのWrapがうまくいっていない
  const filteredIconAriaLabel = useMemo(
    () => (hasStatusText ? undefined : innerText(status)),
    [status, hasStatusText],
  )

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
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
      <DropdownContent controllable>
        <DropdownScrollArea>
          <ContentLayout>{children}</ContentLayout>
        </DropdownScrollArea>
        <BottomLayout themes={themes}>
          {onReset && (
            <ResetButtonLayout>
              <Button variant="text" size="s" prefix={<FaUndoAltIcon />} onClick={() => onReset()}>
                {resetButton}
              </Button>
            </ResetButtonLayout>
          )}
          <RightButtonLayout>
            <DropdownCloser>
              <Button onClick={() => onCancel?.()}>{cancelButton}</Button>
            </DropdownCloser>
            <DropdownCloser>
              <Button value="primary" onClick={() => onApply()}>
                {applyButton}
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
