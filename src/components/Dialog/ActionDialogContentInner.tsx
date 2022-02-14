import React, { ReactNode, VFC, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useOffsetHeight } from './dialogHelper'
import { Stack } from '../Layout'
import { DangerButton, PrimaryButton, SecondaryButton } from '../Button'
import { FaCheckCircleIcon, FaExclamationCircleIcon } from '../Icon'
import { Text } from '../Text'
import { Loader } from '../Loader'
import { useClassNames } from './useClassNames'

export type BaseProps = {
  /**
   * Body of the dialog.
   */
  children: ReactNode
  /**
   * Title of the dialog.
   */
  title: ReactNode
  subtitle?: ReactNode
  titleId: string
  /**
   * Label of close button.
   */
  closeText: ReactNode
  /**
   * Label of action button.
   */
  actionText: ReactNode
  /**
   * Action button style theme.
   */
  actionTheme: 'primary' | 'secondary' | 'danger'
  /**
   * Handler function when clicking on action button.<br />
   * Accepts a function that closes dialog as an argument.
   */
  onClickAction: (closeDialog: () => void) => void
  /**
   * Whether action button should be disabled.
   */
  actionDisabled?: boolean
  /**
   * Whether close button should be disabled.
   */
  closeDisabled?: boolean
  /**
   * `className` of the component.
   */
  className?: string
}

type responseMessageType = {
  status: 'success' | 'error' | 'processing'
  text: string
}

export type ActionDialogContentInnerProps = BaseProps & {
  /**
   * Handler function when clicking on close button.
   */
  onClickClose: () => void
  responseMessage?: responseMessageType
}

export const ActionDialogContentInner: VFC<ActionDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
}) => {
  const classNames = useClassNames().dialog
  const theme = useTheme()
  const handleClickAction = useCallback(() => {
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose])
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  let ActionButton = PrimaryButton
  if (actionTheme === 'secondary') ActionButton = SecondaryButton
  if (actionTheme === 'danger') ActionButton = DangerButton

  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  return (
    <>
      <TitleArea gap={0.25} themes={theme} ref={titleRef} className={classNames.titleArea}>
        {subtitle && (
          <Text as="p" size="S" leading="TIGHT" color="TEXT_GREY" className={classNames.subtitle}>
            {subtitle}
          </Text>
        )}
        <Text id={titleId} as="p" size="L" leading="TIGHT" className={classNames.title}>
          {title}
        </Text>
      </TitleArea>
      <Body offsetHeight={offsetHeight} className={classNames.body}>
        {children}
      </Body>
      <ActionArea themes={theme} ref={bottomRef} className={classNames.actionArea}>
        <ButtonArea themes={theme} className={classNames.buttonArea}>
          <SecondaryButton
            onClick={onClickClose}
            disabled={closeDisabled || isRequestProcessing}
            className={classNames.closeButton}
          >
            {closeText}
          </SecondaryButton>
          <ActionButton
            onClick={handleClickAction}
            disabled={actionDisabled || isRequestProcessing}
            className={classNames.actionButton}
          >
            {actionText}
          </ActionButton>
        </ButtonArea>
        {responseMessage && (
          <MessageWrapper role="alert" className={classNames.alert} themes={theme}>
            {responseMessage.status === 'success' ? (
              <FaCheckCircleIcon color={theme.color.MAIN} />
            ) : responseMessage.status === 'error' ? (
              <FaExclamationCircleIcon color={theme.color.DANGER} />
            ) : (
              <Spinner size="s" themes={theme} />
            )}
            <Message themes={theme}>{responseMessage.text}</Message>
          </MessageWrapper>
        )}
      </ActionArea>
    </>
  )
}

const TitleArea = styled(Stack)<{ themes: Theme }>(
  ({ themes: { border, spacing } }) => css`
    border-bottom: ${border.shorthand};
    padding: ${spacing.XS} ${spacing.S};
  `,
)
const Body = styled.div<{ offsetHeight: number }>`
  ${({ offsetHeight }) => {
    return css`
      max-height: calc(100vh - ${offsetHeight}px);
      overflow: auto;
    `
  }}
`
const ActionArea = styled.div<{ themes: Theme }>(({ themes: { spacing, border } }) => {
  return css`
    display: flex;
    flex-direction: column;
    border-top: ${border.shorthand};
    padding: ${spacing.XS} ${spacing.S};

    &&& > * + * {
      margin-top: 0.5rem;
    }
  `
})
const ButtonArea = styled.div<{ themes: Theme }>(({ themes: { spacing } }) => {
  return css`
    display: flex;
    justify-content: flex-end;

    > * + * {
      margin-left: ${spacing.XS};
    }
  `
})
const MessageWrapper = styled.div<{ themes: Theme }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0;
  margin-bottom: 0;
  font-size: ${({ themes }) => themes.fontSize.M};
`
const Spinner = styled(Loader)<{ themes: Theme }>`
  &&& {
    > div {
      width: 18px;
      height: 18px;
    }

    > div > div {
      border-color: ${({ themes }) => themes.color.TEXT_GREY};
    }
  }
`
const Message = styled.span<{ themes: Theme }>`
  margin-left: ${({ themes }) => themes.spacingByChar(0.25)};
`
