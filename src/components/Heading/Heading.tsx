import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

export interface HeadingProps {
  children: string
  type?: 'ScreenTitle' | 'SectionTitle' | 'BlockTitle' | 'SubBlockTitle' | 'SubSubBlockTitle'
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const HeadingComponent: React.FC<HeadingProps & InjectedProps> = ({ theme, ...props }) => (
  <Wrapper
    as={props.tag ? props.tag : 'h1'}
    theme={theme}
    type={props.type ? props.type : 'ScreenTitle'}
  >
    {props.children}
  </Wrapper>
)

export const Heading = withTheme(HeadingComponent)

const ScreenTitleStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      color: ${theme.palette.TEXT_BLACK};
      font-size: ${theme.size.pxToRem(theme.size.font.VENTI)};
      font-weight: normal;
    `
  }}
`

const SectionTitleStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      color: ${theme.palette.TEXT_BLACK};
      font-size: ${theme.size.pxToRem(theme.size.font.GRANDE)};
      font-weight: normal;
    `
  }}
`

const BlockTitleStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      color: ${theme.palette.TEXT_BLACK};
      font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
      font-weight: bold;
    `
  }}
`

const SubBlockTitleStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      color: ${theme.palette.TEXT_GREY};
      font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
      font-weight: bold;
    `
  }}
`

const SubSubBlockTitleStyle = css`
  ${({ theme }: InjectedProps) => {
    return css`
      color: ${theme.palette.TEXT_GREY};
      font-size: ${theme.size.pxToRem(theme.size.font.SHORT)};
      font-weight: bold;
    `
  }}
`

const Wrapper = styled.h1`
  ${({ type }: HeadingProps) => {
    return css`
      display: block;
      margin: 0;
      padding: 0;
      line-height: 1;

      ${type === 'ScreenTitle'
        ? ScreenTitleStyle
        : type === 'SectionTitle'
        ? SectionTitleStyle
        : type === 'BlockTitle'
        ? BlockTitleStyle
        : type === 'SubBlockTitle'
        ? SubBlockTitleStyle
        : type === 'SubSubBlockTitle'
        ? SubSubBlockTitleStyle
        : ScreenTitleStyle}
    `
  }}
`
