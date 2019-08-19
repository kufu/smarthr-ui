import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Tag } from '../Tag/Tag'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'

interface Props {
  label?: string
  buttons?: AppNaviButtonProps[]
}

const AppNaviComponent: React.FC<Props & InjectedProps> = ({ theme, ...props }) => (
  <Wrapper theme={theme}>
    {props.label && (
      <TagWrapper theme={theme}>
        <Tag skeleton>{props.label}</Tag>
      </TagWrapper>
    )}

    {props.buttons &&
      props.buttons.map(button => (
        <AppNaviButton
          label={button.label}
          icon={button.icon}
          url={button.url}
          target={button.target}
          current={button.current}
          key={button.label}
        ></AppNaviButton>
      ))}
  </Wrapper>
)

export const AppNavi = withTheme(AppNaviComponent)

const Wrapper: any = styled.nav`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      width: 100%;
      height: ${theme.size.pxToRem(40)};
      padding: 0 ${theme.size.pxToRem(20)};
      background-color: #fff;
      box-shadow: 0 ${theme.size.pxToRem(1)} ${theme.size.pxToRem(4)} rgba(0, 0, 0, 0.15);
    `
  }}
`

const TagWrapper: any = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      margin-right: ${theme.size.pxToRem(theme.size.space.XS)};
    `
  }}
`
