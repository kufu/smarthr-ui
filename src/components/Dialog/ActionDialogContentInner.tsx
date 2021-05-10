import React, { VFC, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useOffsetHeight } from './dialogHelper'
import { DangerButton, PrimaryButton, SecondaryButton } from '../Button'
import { FaCheckCircleIcon, FaExclamationTriangleIcon } from '../Icon'
import { Loader } from '../Loader'
import { useClassNames } from './useClassNames'

export type BaseProps = {
  /**
   * Body of the dialog.
   */
  children: React.ReactNode
  /**
   * Title of the dialog.
   */
  title: string
  /**
   * Label of close button.
   */
  closeText: string
  /**
   * Label of action button.
   */
  actionText: string
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
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
}) => {
  const classNames = useClassNames()
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
      <Title themes={theme} ref={titleRef} className={classNames.title}>
        {title}
      </Title>
      <Body offsetHeight={offsetHeight} className={classNames.body}>
        {children}
      </Body>
      <ActionArea themes={theme} ref={bottomRef} className={classNames.actionArea}>
        <ButtonArea themes={theme} className={classNames.buttonArea}>
          <SecondaryButton
            onClick={onClickClose}
            disabled={closeDisabled || isRequestProcessing}
            className={classNames.secondaryButton}
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
        <div role="alert" className={classNames.alert}>
          <ResponseMessage themes={theme} responseMessage={responseMessage} />
        </div>
      </ActionArea>
    </>
  )
}

const Title = styled.p<{ themes: Theme }>`
  ${({ themes: { fontSize, border, spacing } }) => {
    const { pxToRem } = fontSize
    return css`
      margin: 0;
      padding: ${spacing.XS} ${spacing.S};
      border-bottom: ${border.shorthand};
      font-size: ${pxToRem(fontSize.GRANDE)};
      line-height: 1;
    `
  }}
`
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
const ResponseMessage: React.VFC<{
  themes: Theme
  responseMessage?: responseMessageType
}> = ({ themes, responseMessage }) => {
  if (!responseMessage) {
    return null
  }

  const {
    color,
    fontSize: { pxToRem, TALL },
  } = themes
  const { status, text } = responseMessage
  const Wrapper = styled.p`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 0;
    margin-bottom: 0;
    font-size: ${pxToRem(TALL)};
  `
  const Spinner = styled(Loader)`
    &&& {
      > div {
        width: 1rem;
        height: 1rem;
      }

      > div > div {
        border-color: ${color.TEXT_GREY};
      }
    }
  `
  const Icon =
    status === 'success' ? (
      <FaCheckCircleIcon color={color.MAIN} />
    ) : status === 'error' ? (
      <FaExclamationTriangleIcon color={color.DANGER} />
    ) : (
      <Spinner size="s" />
    )
  const Message = styled.span`
    margin-left: 0.25rem;
  `

  return (
    <Wrapper>
      {Icon}
      <Message>{text}</Message>
    </Wrapper>
  )
}
const ButtonArea = styled.div<{ themes: Theme }>(({ themes: { spacing } }) => {
  return css`
    display: flex;
    justify-content: flex-end;

    > * + * {
      margin-left: ${spacing.XS};
    }
  `
})
