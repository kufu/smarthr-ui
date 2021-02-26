import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Heading, Props as HeadingProps } from '../Heading'

export type DefinitionListItemProps = {
  term: ReactNode
  description: ReactNode
  termTag?: HeadingProps['tag']
  className?: string
}

export const DefinitionListItem: VFC<DefinitionListItemProps> = ({
  term,
  description,
  termTag = 'span',
  className = '',
}) => {
  const theme = useTheme()

  return (
    <Wrapper className={className} themes={theme}>
      <dt>
        <Heading tag={termTag} type="subSubBlockTitle">
          {term}
        </Heading>
      </dt>
      <Content themes={theme}>{description}</Content>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, size } = themes

    return css`
      padding-bottom: ${size.pxToRem(5)};
      border-bottom: 1px dotted ${palette.BORDER};
    `
  }}
`
const Content = styled.dd<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      margin: ${size.pxToRem(5)} 0 0;
      padding: 0;
      color: ${palette.TEXT_BLACK};
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: 1.5;
    `
  }}
`
