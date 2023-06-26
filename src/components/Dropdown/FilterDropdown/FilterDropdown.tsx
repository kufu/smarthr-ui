import React, { ButtonHTMLAttributes, FC, ReactNode, useMemo } from 'react'
import innerText from 'react-innertext'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Button } from '../../Button'
import { FaCheckCircleIcon, FaFilterIcon, FaUndoAltIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { DropdownTrigger } from '../DropdownTrigger'

import type { DecoratorType, DecoratorsType, ResponseMessageType } from '../../../types'

type Props = {
  isFiltered?: boolean
  onApply: React.MouseEventHandler<HTMLButtonElement>
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
const APPLY_BUTTON_TEXT = '適用'
const CANCEL_BUTTON_TEXT = 'キャンセル'
const RESET_BUTTON_TEXT = '絞り込み条件を解除'

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
  const applyButton: ReactNode = useMemo(
    () => executeDecorator(APPLY_BUTTON_TEXT, decorators?.applyButton),
    [decorators],
  )
  const cancelButton: ReactNode = useMemo(
    () => executeDecorator(CANCEL_BUTTON_TEXT, decorators?.cancelButton),
    [decorators],
  )
  const resetButton: ReactNode = useMemo(
    () => executeDecorator(RESET_BUTTON_TEXT, decorators?.resetButton),
    [decorators],
  )
  const filteredIconAriaLabel = useMemo(
    () => (hasStatusText ? undefined : innerText(status)),
    [status, hasStatusText],
  )
  const isRequestProcessing =
    responseMessage !== undefined && responseMessage.status === 'processing'

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          {...props}
          suffix={
            <IsFilteredIconWrapper isFiltered={isFiltered} themes={themes}>
              <FaFilterIcon />
              {isFiltered ? <FilteredCheckIcon aria-label={filteredIconAriaLabel} /> : null}
            </IsFilteredIconWrapper>
          }
        >
          {triggerButton}
        </Button>
      </DropdownTrigger>
      {hasStatusText && isFiltered ? <StatusText themes={themes}>{status}</StatusText> : null}
      <DropdownContent controllable>
        <DropdownScrollArea>
          <ContentLayout themes={themes}>{children}</ContentLayout>
        </DropdownScrollArea>
        <ActionArea themes={themes}>
          <Cluster gap={1} align="center" justify="space-between">
            {onReset && (
              <ResetButtonLayout themes={themes}>
                <Button
                  variant="text"
                  size="s"
                  prefix={<FaUndoAltIcon />}
                  onClick={onReset}
                  disabled={isRequestProcessing}
                >
                  {resetButton}
                </Button>
              </ResetButtonLayout>
            )}

            <RightButtonLayout>
              <DropdownCloser>
                <Button onClick={onCancel} disabled={isRequestProcessing}>
                  {cancelButton}
                </Button>
              </DropdownCloser>
              <DropdownCloser>
                <Button variant="primary" onClick={onApply} loading={isRequestProcessing}>
                  {applyButton}
                </Button>
              </DropdownCloser>
            </RightButtonLayout>
          </Cluster>
          {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
            <Message>
              <ResponseMessage type={responseMessage.status} role="alert">
                {responseMessage.text}
              </ResponseMessage>
            </Message>
          )}
        </ActionArea>
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
const FilteredCheckIcon = styled(FaCheckCircleIcon)`
  width: 0.5em;
  height: 0.5em;
`
const StatusText = styled.span<{ themes: Theme }>`
  margin-left: ${({ themes }) => themes.spacing.XXS};
  font-size: ${({ themes }) => themes.fontSize.S};
`
const ContentLayout = styled.div<{ themes: Theme }>`
  ${({ themes: { space } }) => css`
    padding: ${space(1.5)};
  `}
`
const ActionArea = styled(Stack).attrs({ gap: 0.5 })<{ themes: Theme }>`
  ${({ themes: { space, border } }) => css`
    border-block-start: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`
const ResetButtonLayout = styled.div<{ themes: Theme }>`
  ${({ themes: { space } }) => css`
    margin-inline-start: ${space(-0.5)};
  `}
`
const RightButtonLayout = styled(Cluster).attrs({
  gap: { column: 1, row: 0.5 },
  justify: 'flex-end',
})`
  margin-inline-start: auto;
`
const Message = styled.div`
  text-align: right;
`
