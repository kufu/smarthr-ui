import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { HeadingProps, Heading } from '../Heading/Heading'

interface Props {
  heading: HeadingProps
  description?: React.ReactNode
}

const HeadlineAreaComponent: React.FC<Props & InjectedProps> = ({ theme, ...props }) => (
  <Wrapper theme={theme}>
    <Heading type="ScreenTitle" tag={props.heading.tag ? props.heading.tag : 'h1'}>
      {props.heading.children}
    </Heading>
    {props.description && <Description theme={theme}>{props.description}</Description>}
  </Wrapper>
)

export const HeadlineArea = withTheme(HeadlineAreaComponent)

const Wrapper = styled.div`
  display: block;
  margin: 0;
  padding: 0;
`

const Description = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      margin-top: ${theme.size.pxToRem(theme.size.space.XS)};
      color: ${theme.palette.TEXT_BLACK};
      font-size: ${theme.size.font.TALL};
      line-height: 1.5;
    `
  }}
`
