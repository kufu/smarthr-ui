import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { Heading, Props as HeadingProps } from '../Heading'

export type DefinitionListItemProps = {
  term: ReactNode
  description: ReactNode
  termTag?: HeadingProps['tag']
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof DefinitionListItemProps>

export const DefinitionListItem: VFC<DefinitionListItemProps & ElementProps> = ({
  term,
  description,
  termTag = 'span',
  className = '',
}) => {
  const theme = useTheme()
  const { definitionListItem } = useClassNames()

  return (
    <Wrapper className={`${className} ${definitionListItem.wrapper}`} themes={theme}>
      <dt className={definitionListItem.term}>
        <Heading tag={termTag} type="subSubBlockTitle">
          {term}
        </Heading>
      </dt>
      <Content themes={theme} className={definitionListItem.description}>
        {description}
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { color, spacingByChar } = themes

    return css`
      padding-bottom: ${spacingByChar(0.25)};
      border-bottom: 1px dotted ${color.BORDER};
    `
  }}
`
const Content = styled.dd<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar, fontSize, color } = themes

    return css`
      margin: ${spacingByChar(0.25)} 0 0;
      padding: 0;
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      line-height: 1.5;
      word-break: break-word;
    `
  }}
`
