import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Heading, HeadingProps } from '../Heading'

export interface DefinitionListItemProps {
  label: string
  labelTag?: HeadingProps['tag']
  children: React.ReactNode
  className?: string
}

const DefinitionListItemComponent: React.FC<DefinitionListItemProps & InjectedProps> = ({
  label,
  labelTag = 'span',
  children,
  className = '',
  theme,
}) => (
  <Wrapper theme={theme} className={className}>
    <Heading tag={labelTag} type="subSubBlockTitle">
      {label}
    </Heading>
    <Content theme={theme}>{children}</Content>
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

const Content = styled.div`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      margin-top: ${size.pxToRem(size.space.XXS)};
    `
  }}
`
