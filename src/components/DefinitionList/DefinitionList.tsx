import React, { FC, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { DefinitionListItem, DefinitionListItemProps } from './DefinitionListItem'
import { useClassNames } from './useClassNames'

type Props = {
  /** 定義リストのアイテムの配列 */
  items: DefinitionListItemProps[]
  /** 最大列数 */
  maxColumns?: number
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDListElement>, keyof Props>

export const DefinitionList: FC<Props & ElementProps> = ({ items, maxColumns, className = '' }) => {
  const classNames = useClassNames()
  const theme = useTheme()

  return (
    <Wrapper themes={theme} className={`${className} ${classNames.definitionList.wrapper}`}>
      {items.map(({ term, description, className: itemClassName }, index) => (
        <DefinitionListItem
          term={term}
          description={description}
          key={index}
          maxColumns={maxColumns}
          className={itemClassName}
        />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.dl<{ themes: Theme }>`
  ${({ themes: { space } }) => {
    // const minWidth = `calc(12em * ${maxColumns} - (${space(1.5)} * ${maxColumns - 1}))`
    // const maxWidth = `calc(30em * ${maxColumns} - (${space(1.5)} * ${maxColumns - 1}))`
    return css`
      display: flex;
      flex-wrap: wrap;
      gap: ${space(1.5)};
    `
  }}
`
