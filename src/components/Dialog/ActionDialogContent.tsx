import React, { useContext, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { SecondaryButton, PrimaryButton, DangerButton } from '../Button'
import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'

type Props = {
  children: React.ReactNode
  title: string
  closeText: string
  actionText: string
  actionTheme: 'primary' | 'secondary' | 'danger'
  onClickAction: (closeDialog: () => void) => void
  actionDisabled?: boolean
  top?: number
  right?: number
  bottom?: number
  left?: number
}

const ActionDialogContentComponent: React.FC<Props & InjectedProps> = ({
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  actionDisabled = false,
  theme,
  ...props
}) => {
  const { DialogContentRoot, onClickClose } = useContext(DialogContext)
  const handleClickAction = useCallback(() => {
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose])

  let ActionButton = PrimaryButton
  if (actionTheme === 'secondary') ActionButton = SecondaryButton
  if (actionTheme === 'danger') ActionButton = DangerButton

  return (
    <DialogContentRoot>
      <DialogContentInner onClickOverlay={onClickClose} {...props}>
        <Title theme={theme}>{title}</Title>
        {children}
        <Bottom theme={theme}>
          <SecondaryButton onClick={onClickClose}>{closeText}</SecondaryButton>
          <ActionButton onClick={handleClickAction}>{actionText}</ActionButton>
        </Bottom>
      </DialogContentInner>
    </DialogContentRoot>
  )
}

export const ActionDialogContent = withTheme(ActionDialogContentComponent)

const Title = styled.p`
  ${({ theme }: InjectedProps) => {
    const { pxToRem, space, font } = theme.size
    const { border } = theme.frame
    return css`
      margin: 0;
      padding: ${pxToRem(space.XS)} ${pxToRem(space.S)};
      border-bottom: ${border.default};
      font-size: ${pxToRem(font.GRANDE)};
      line-height: 1;
    `
  }}
`
const Bottom = styled.div`
  ${({ theme }: InjectedProps) => {
    const { pxToRem, space } = theme.size
    const { border } = theme.frame
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
