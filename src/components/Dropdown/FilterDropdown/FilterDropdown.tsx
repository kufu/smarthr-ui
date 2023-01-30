import React, { ReactNode, VFC, useMemo } from 'react'
import innerText from 'react-innertext'
import styled from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { DecoratorType, DecoratorsType } from '../../../types/props'
import { Button } from '../../Button'
import { FaCheckCircleIcon, FaFilterIcon, FaUndoAltIcon } from '../../Icon'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { DropdownTrigger } from '../DropdownTrigger'

type Props = {
  isFiltered?: boolean
  onApply: () => void
  onCancel?: () => void
  onReset?: () => void
  children: ReactNode
  hasStatusText?: boolean
  /**
   * @deprecated decorator属性は非推奨です。decorators属性を利用してください。
   */
  decorator?: DecoratorsType<
    'status' | 'triggerButton' | 'applyButton' | 'cancelButton' | 'resetButton'
  >
  decorators?: DecoratorsType<
    'status' | 'triggerButton' | 'applyButton' | 'cancelButton' | 'resetButton'
  >
}

const STATUS_FILTERED_TEXT = '適用中'
const TRIGGER_BUTTON_TEXT = '絞り込み'
const APPLY_BUTTON_TEXT = '適用'
const CANCEL_BUTTON_TEXT = 'キャンセル'
const RESET_BUTTON_TEXT = '絞り込み条件を解除'

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

export const FilterDropdown: VFC<Props> = ({
  isFiltered = false,
  onApply,
  onCancel,
  onReset,
  children,
  hasStatusText,
  decorator,
  decorators,
}: Props) => {
  const themes = useTheme()
  const status: ReactNode = useMemo(
    () => executeDecorator(STATUS_FILTERED_TEXT, decorator?.status || decorators?.status),
    [decorator, decorators],
  )
  const triggerButton: ReactNode = useMemo(
    () =>
      executeDecorator(TRIGGER_BUTTON_TEXT, decorator?.triggerButton || decorators?.triggerButton),
    [decorator, decorators],
  )
  const applyButton: ReactNode = useMemo(
    () => executeDecorator(APPLY_BUTTON_TEXT, decorator?.applyButton || decorators?.applyButton),
    [decorator, decorators],
  )
  const cancelButton: ReactNode = useMemo(
    () => executeDecorator(CANCEL_BUTTON_TEXT, decorator?.cancelButton || decorators?.cancelButton),
    [decorator, decorators],
  )
  const resetButton: ReactNode = useMemo(
    () => executeDecorator(RESET_BUTTON_TEXT, decorator?.resetButton || decorators?.resetButton),
    [decorator, decorators],
  )
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
              <Button variant="primary" onClick={() => onApply()}>
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
