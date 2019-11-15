import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { DefinitionListItem, DefinitionListItemProps } from './DefinitionListItem'

interface Props {
  layout?: LayoutType
  items: DefinitionListItemProps[]
  className?: string
}

type LayoutType = 'single' | 'double' | 'triple'

const DefinitionListComponent: React.FC<Props & InjectedProps> = ({
  items,
  layout = 'single',
  className = '',
  theme,
}) => (
  <Wrapper className={className} layout={layout}>
    {items.map((item, index) => (
      <Item
        term={item.term}
        description={item.description}
        key={index}
        theme={theme}
        layout={layout}
        className={item.className && item.className}
      />
    ))}
  </Wrapper>
)

export const DefinitionList = withTheme(DefinitionListComponent)

const Wrapper = styled.dl<{ layout: LayoutType }>`
  ${({ layout }) => {
    const baseStyle = css`
      padding: 0;
      margin: 0;
    `

    const flexStyle = css`
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
    `

    switch (layout) {
      case 'double':
        return css`
          ${baseStyle}
          ${flexStyle}
        `
      case 'triple':
        return css`
          ${baseStyle}
          ${flexStyle}
          &:after {
            content: '';
            display: block;
            flex-basis: calc(33.333333% - 12px);
          }
        `
      default:
        return css`
          ${baseStyle}
          display: block;
        `
    }
  }}
`

const Item = styled(DefinitionListItem)<InjectedProps & { layout: LayoutType }>`
  ${({ theme, layout }) => {
    const { size } = theme
    const basicStyle = css`
      margin-bottom: ${size.pxToRem(size.space.S)};
    `

    switch (layout) {
      case 'double':
        return css`
          ${basicStyle}
          flex-basis: calc(50% - 12px);

          &:last-child,
          &:nth-last-child(2) {
            margin-bottom: 0;
          }
        `
      case 'triple':
        return css`
          ${basicStyle}
          flex-basis: calc(33.333333% - 12px);

          &:last-child,
          &:nth-last-child(2),
          &:nth-last-child(3) {
            margin-bottom: 0;
          }
        `
      default:
        return css`
          ${basicStyle}

          &:last-child {
            margin-bottom: 0;
          }
        `
    }
  }}
`
