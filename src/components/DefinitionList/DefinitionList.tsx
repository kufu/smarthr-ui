import React, { FC, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { DefinitionListItem, DefinitionListItemProps } from './DefinitionListItem'
import { Cluster } from '../Layout'

type LayoutType = 'single' | 'double' | 'triple'
type Props = {
  /** 定義リストのアイテムの配列 */
  items: DefinitionListItemProps[]
  /** 列のレイアウト */
  layout?: LayoutType
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDListElement>, keyof Props>

export const DefinitionList: FC<Props & ElementProps> = ({
  items,
  layout = 'single',
  className = '',
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper className={`${className} ${classNames.definitionList.wrapper}`}>
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

const column = (layout: LayoutType) => {
  switch (layout) {
    case 'single':
      return 1
    case 'double':
      return 2
    case 'triple':
      return 3
  }
}

const Wrapper = styled(Cluster).attrs({ as: 'dl', gap: 1.5 })`
  margin-block: initial;
`

const Item = styled(DefinitionListItem)<{ themes: Theme; layout: LayoutType }>`
  ${({ layout, themes: { space } }) => {
    const $columns = column(layout)
    return css`
      flex-basis: calc((100% - (${space(1.5)} * ${$columns - 1})) / ${$columns});
      flex-shrink: 1;
    `
  }}
`
