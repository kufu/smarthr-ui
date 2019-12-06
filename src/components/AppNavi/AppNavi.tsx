import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { StatusLabel } from '../StatusLabel/StatusLabel'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'

interface Props {
  label?: string
  buttons?: AppNaviButtonProps[]
  children?: React.ReactNode
}

export const AppNavi: FC<Props> = ({ label, buttons, children = null }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      {label && (
        <StatusLabelWrapper themes={theme}>
          <StatusLabel>{label}</StatusLabel>
        </StatusLabelWrapper>
      )}

      {buttons &&
        buttons.map((button, index) => (
          <AppNaviButton
            icon={button.icon}
            current={button.current}
            key={index}
            onClick={button.onClick}
          >
            {button.children}
          </AppNaviButton>
        ))}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.nav<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem } = themes.size

    return css`
      display: flex;
      align-items: center;
      width: 100%;
      height: ${pxToRem(40)};
      padding: 0 ${pxToRem(20)};
      background-color: #fff;
      box-sizing: border-box;
      box-shadow: 0 ${pxToRem(1)} ${pxToRem(4)} rgba(0, 0, 0, 0.15);
    `
  }}
`
const StatusLabelWrapper = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: inline-block;
      margin-right: ${pxToRem(space.XS)};
    `
  }}
`
