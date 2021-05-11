import React, { HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { DefinitionListItem, DefinitionListItemProps } from './DefinitionListItem'

type LayoutType = 'single' | 'double' | 'triple'
type Props = {
  items: DefinitionListItemProps[]
  layout?: LayoutType
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDListElement>, keyof Props>

export const DefinitionList: VFC<Props & ElementProps> = ({
  items,
  layout = 'single',
  className = '',
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper className={`${className} ${classNames.definitionList.wrapper}`} layout={layout}>
      {items.map(({ term, description, className: itemClassName }, index) => (
        <Item
          term={term}
          description={description}
          key={index}
          layout={layout}
          className={itemClassName}
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
  ${({ themes: { spacingByChar }, layout }) => {
    const basicStyle = css`
      margin-bottom: ${spacingByChar(1.5)};
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
