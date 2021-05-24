import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Heading, Props as HeadingProps } from '../Heading'

type Props = {
  heading: {
    children: HeadingProps['children']
    tag?: HeadingProps['tag']
  }
  description?: ReactNode
  className?: string
}

export const HeadlineArea: VFC<Props> = ({ heading, description, className = '' }) => {
  const theme = useTheme()

  return (
    <Wrapper theme={theme} className={className}>
      <Heading type="screenTitle" tag={heading.tag ? heading.tag : 'h1'}>
        {heading.children}
      </Heading>
      {description && <Description themes={theme}>{description}</Description>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;
  margin: 0;
  padding: 0;
`
const Description = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, spacingByChar, palette } = themes

    return css`
      margin-top: ${spacingByChar(1)};
      color: ${palette.TEXT_BLACK};
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: 1.5;
    `
  }}
`
