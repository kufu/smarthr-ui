import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

export interface HeadingProps {
  children: string
  type?: 'screenTitle' | 'sectionTitle' | 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle'
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
}

const HeadingComponent: React.FC<HeadingProps & InjectedProps> = ({
  tag = 'h1',
  type = 'ScreenTitle',
  className = '',
  children,
  theme,
}) => (
  <Wrapper as={tag} className={`${type} ${className}`} theme={theme}>
    {children}
  </Wrapper>
)

export const Heading = withTheme(HeadingComponent)

const Wrapper = styled.h1`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      margin: 0;
      padding: 0;
      line-height: 1;

      &.screenTitle {
        color: ${theme.palette.TEXT_BLACK};
        font-size: ${theme.size.pxToRem(theme.size.font.VENTI)};
        font-weight: normal;
      }

      &.sectionTitle {
        color: ${theme.palette.TEXT_BLACK};
        font-size: ${theme.size.pxToRem(theme.size.font.GRANDE)};
        font-weight: normal;
      }

      &.blockTitle {
        color: ${theme.palette.TEXT_BLACK};
        font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
        font-weight: bold;
      }

      &.subBlockTitle {
        color: ${theme.palette.TEXT_GREY};
        font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
        font-weight: bold;
      }

      &.subSubBlockTitle {
        color: ${theme.palette.TEXT_GREY};
        font-size: ${theme.size.pxToRem(theme.size.font.SHORT)};
        font-weight: bold;
      }
    `
  }}
`
