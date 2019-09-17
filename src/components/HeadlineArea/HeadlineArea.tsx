import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { HeadingProps, Heading } from '../Heading/Heading'

interface Props {
  heading: {
    children: HeadingProps['children']
    tag?: HeadingProps['tag']
  }
  description?: React.ReactNode
  className?: string
}

const HeadlineAreaComponent: React.FC<Props & InjectedProps> = ({
  heading,
  description,
  className = '',
  theme,
}) => (
  <Wrapper theme={theme} className={className}>
    <Heading type="screenTitle" tag={heading.tag ? heading.tag : 'h1'}>
      {heading.children}
    </Heading>
    {description && <Description theme={theme}>{description}</Description>}
  </Wrapper>
)

export const HeadlineArea = withTheme(HeadlineAreaComponent)

const Wrapper = styled.div`
  display: block;
  margin: 0;
  padding: 0;
`

const Description = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      margin-top: ${theme.size.pxToRem(theme.size.space.XS)};
      color: ${theme.palette.TEXT_BLACK};
      font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
      line-height: 1.5;
    `
  }}
`
