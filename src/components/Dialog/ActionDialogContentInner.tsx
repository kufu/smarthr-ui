import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { PrimaryButton, SecondaryButton, DangerButton } from '../Button'

type Props = {
  children: React.ReactNode
  title: string
  closeText: string
  actionText: string
  actionTheme: 'primary' | 'secondary' | 'danger'
  onClickAction: (closeDialog: () => void) => void
  onClickClose: () => void
  actionDisabled?: boolean
}

const ActionDialogContentInnerComponent: React.FC<Props & InjectedProps> = ({
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  actionDisabled = false,
  theme,
}) => {
  const handleClickAction = useCallback(() => {
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose])

  let ActionButton = PrimaryButton
  if (actionTheme === 'secondary') ActionButton = SecondaryButton
  if (actionTheme === 'danger') ActionButton = DangerButton

  return (
    <>
      <Title theme={theme}>{title}</Title>
      {children}
      <Bottom theme={theme}>
        <SecondaryButton onClick={onClickClose}>{closeText}</SecondaryButton>
        <ActionButton onClick={handleClickAction} disabled={actionDisabled}>
          {actionText}
        </ActionButton>
      </Bottom>
    </>
  )
}

export const ActionDialogContentInner = withTheme(ActionDialogContentInnerComponent)

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
