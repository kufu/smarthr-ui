import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { Heading, HeadingProps } from '../Heading'

export type DefinitionListItemProps = {
  term: string
  termTag?: HeadingProps['tag']
  description: React.ReactNode
  className?: string
}

export const DefinitionListItem: FC<DefinitionListItemProps> = ({
  term,
  termTag = 'span',
  description,
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
      border-bottom: 1px dotted ${palette.BORDER};
      padding-bottom: ${size.pxToRem(size.space.XXS)};
    `
  }}
`
const Content = styled.dd<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      padding: 0;
      margin: ${pxToRem(space.XXS)} 0 0;
    `
  }}
`
