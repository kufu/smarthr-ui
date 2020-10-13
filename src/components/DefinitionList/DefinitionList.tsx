import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { DefinitionListItem, DefinitionListItemProps } from './DefinitionListItem'

type LayoutType = 'single' | 'double' | 'triple'
type Props = {
  items: DefinitionListItemProps[]
  layout?: LayoutType
  className?: string
}

export const DefinitionList: FC<Props> = ({ items, layout = 'single', className = '' }) => {
  const theme = useTheme()

  return (
    <Wrapper className={className} layout={layout}>
      {items.map((item, index) => (
        <Item
          term={item.term}
          description={item.description}
          key={index}
          layout={layout}
          className={item.className && item.className}
          themes={theme}
        />
      ))}
    </Wrapper>
  )
}

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
          &::after {
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
const Item = styled(DefinitionListItem)<{ themes: Theme; layout: LayoutType }>`
  ${({ themes, layout }) => {
    const { pxToRem, space } = themes.size
    const basicStyle = css`
      margin-bottom: ${pxToRem(space.S)};
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
