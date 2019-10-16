import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { StatusLabel } from '../StatusLabel/StatusLabel'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'

interface Props {
  label?: string
  buttons?: AppNaviButtonProps[]
  children?: React.ReactNode
}

const AppNaviComponent: React.FC<Props & InjectedProps> = ({
  theme,
  label,
  buttons,
  children = null,
}) => (
  <Wrapper theme={theme}>
    {label && (
      <TagWrapper theme={theme}>
        <StatusLabel type="done">{label}</StatusLabel>
      </TagWrapper>
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

export const AppNavi = withTheme(AppNaviComponent)

const Wrapper = styled.nav`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      width: 100%;
      height: ${theme.size.pxToRem(40)};
      padding: 0 ${theme.size.pxToRem(20)};
      background-color: #fff;
      box-sizing: border-box;
      box-shadow: 0 ${theme.size.pxToRem(1)} ${theme.size.pxToRem(4)} rgba(0, 0, 0, 0.15);
    `
  }}
`

const TagWrapper = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      margin-right: ${theme.size.pxToRem(theme.size.space.XS)};
    `
  }}
`
