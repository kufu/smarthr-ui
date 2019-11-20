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
      padding-bottom: ${size.pxToRem(size.space.XXS)};
      border-bottom: 1px dotted ${palette.BORDER};
    `
  }}
`
const Content = styled.dd`
  ${({ theme }: InjectedProps) => {
    const { size, palette } = theme

    return css`
      margin: ${size.pxToRem(size.space.XXS)} 0 0;
      padding: 0;
      color: ${palette.TEXT_BLACK};
      font-size: ${size.pxToRem(size.font.TALL)};
    `
  }}
`
