import React, { FC, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useOffsetHeight } from './dialogHelper'
import { DangerButton, PrimaryButton, SecondaryButton } from '../Button'

export type BaseProps = {
  children: React.ReactNode
  title: string
  closeText: string
  actionText: string
  actionTheme: 'primary' | 'secondary' | 'danger'
  onClickAction: (closeDialog: () => void) => void
  actionDisabled?: boolean
}

type Props = BaseProps & {
  onClickClose: () => void
}

export const ActionDialogContentInner: FC<Props> = ({
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  actionDisabled = false,
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
        <SecondaryButton onClick={onClickClose}>{closeText}</SecondaryButton>
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
