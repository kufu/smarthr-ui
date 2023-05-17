import React, { ReactNode, useCallback, useContext, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { DecoratorType, DecoratorsType, ResponseMessageType } from '@/types/props'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Button } from '../../Button'
import { FaCheckCircleIcon, FaExclamationCircleIcon, FaUndoAltIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { DropdownContext } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownScrollArea } from '../DropdownScrollArea'

type Props = {
  onApply: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void) => void
  onCancel?: React.MouseEventHandler<HTMLButtonElement>
  onReset?: React.MouseEventHandler<HTMLButtonElement>
  children: ReactNode
  decorators?: DecoratorsType<'applyButton' | 'cancelButton' | 'resetButton'>
  responseMessage?: ResponseMessageType
}

const APPLY_BUTTON_TEXT = '適用'
const CANCEL_BUTTON_TEXT = 'キャンセル'
const RESET_BUTTON_TEXT = '絞り込み条件を解除'

const executeDecorator = (defaultText: string, decorator: DecoratorType | undefined) =>
  decorator?.(defaultText) || defaultText

export const FilterDropdownContent: React.FC<Props> = ({
  children,
  onApply,
  decorators,
  onCancel,
  onReset,
  responseMessage,
}) => {
  const themes = useTheme()
  const { onClickCloser } = useContext(DropdownContext)

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

  const isRequestProcessing =
    responseMessage !== undefined && responseMessage.status === 'processing'

  const handleApply: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      onApply(e, onClickCloser)
    },
    [onApply, onClickCloser],
  )

  return (
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
            <Button variant="primary" onClick={handleApply} loading={isRequestProcessing}>
              {applyButton}
            </Button>
          </RightButtonLayout>
        </Cluster>
        {responseMessage?.status === 'success' && (
          <Message>
            <FaCheckCircleIcon color={themes.color.MAIN} text={responseMessage.text} role="alert" />
          </Message>
        )}
        {responseMessage?.status === 'error' && (
          <Message>
            <FaExclamationCircleIcon
              color={themes.color.DANGER}
              text={responseMessage.text}
              role="alert"
            />
          </Message>
        )}
      </ActionArea>
    </DropdownContent>
  )
}

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
