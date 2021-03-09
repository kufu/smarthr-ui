import React, { VFC, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useOffsetHeight } from './dialogHelper'
import { DangerButton, PrimaryButton, SecondaryButton } from '../Button'

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
}

export type ActionDialogContentInnerProps = BaseProps & {
  /**
   * Handler function when clicking on close button.
   */
  onClickClose: () => void
}

export const ActionDialogContentInner: VFC<ActionDialogContentInnerProps> = ({
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  actionDisabled = false,
  closeDisabled,
}) => {
  const theme = useTheme()
  const handleClickAction = useCallback(() => {
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose])
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  let ActionButton = PrimaryButton
  if (actionTheme === 'secondary') ActionButton = SecondaryButton
  if (actionTheme === 'danger') ActionButton = DangerButton

  return (
    <>
      <Title themes={theme} ref={titleRef}>
        {title}
      </Title>
      <Body offsetHeight={offsetHeight}>{children}</Body>
      <Bottom themes={theme} ref={bottomRef}>
        <SecondaryButton onClick={onClickClose} disabled={closeDisabled}>
          {closeText}
        </SecondaryButton>
        <ActionButton onClick={handleClickAction} disabled={actionDisabled}>
          {actionText}
        </ActionButton>
      </Bottom>
    </>
  )
}

const Title = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space, font } = themes.size
    const { border } = themes.frame
    return css`
      margin: 0;
      padding: ${pxToRem(space.XS)} ${pxToRem(space.S)};
      border-bottom: ${border.default};
      font-size: ${pxToRem(font.GRANDE)};
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
const Bottom = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    const { border } = themes.frame
    return css`
      display: flex;
      justify-content: flex-end;
      margin: 0;
      padding: ${pxToRem(space.XS)} ${pxToRem(space.S)};
      border-top: ${border.default};

      & > *:not(:first-child) {
        margin: 0 0 0 ${pxToRem(space.XS)};
      }
    `
  }}
`
