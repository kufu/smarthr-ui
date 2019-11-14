import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Heading, HeadingProps } from '../Heading'

export interface DefinitionListItemProps {
  term: string
  termTag?: HeadingProps['tag']
  description: React.ReactNode
  className?: string
}

const DefinitionListItemComponent: React.FC<DefinitionListItemProps & InjectedProps> = ({
  term,
  termTag = 'span',
  description,
  className = '',
  theme,
}) => (
  <Wrapper theme={theme} className={className}>
    <dt>
      <Heading tag={termTag} type="subSubBlockTitle">
        {term}
      </Heading>
    </dt>
    <Content theme={theme}>{description}</Content>
  </Wrapper>
)

export const DefinitionListItem = withTheme(DefinitionListItemComponent)

const Wrapper = styled.div`
  ${({ theme }: InjectedProps) => {
    const { palette, size } = theme

    return css`
      border-bottom: 1px dotted ${palette.BORDER};
      padding-bottom: ${size.pxToRem(size.space.XXS)};
    `
  }}
`

const Content = styled.dd`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      padding: 0;
      margin: ${size.pxToRem(size.space.XXS)} 0 0;
    `
  }}
`
