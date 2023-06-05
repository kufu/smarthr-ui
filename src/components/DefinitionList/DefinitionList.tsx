import React, { ComponentProps, FC, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Cluster } from '../Layout'

import { DefinitionListItem } from './DefinitionListItem'
import { useClassNames } from './useClassNames'

type Props = {
  /** 定義リストのアイテムの配列 */
  items: Array<ComponentProps<typeof DefinitionListItem>>
  /** 最大列数 */
  maxColumns?: number
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDListElement>, keyof Props>

export const DefinitionList: FC<Props & ElementProps> = ({ items, maxColumns, className = '' }) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper className={`${className} ${classNames.definitionList.wrapper}`}>
      {items.map(({ term, description, className: itemClassName }, index) => (
        <Item
          term={term}
          description={description}
          key={index}
          maxColumns={maxColumns}
          className={itemClassName}
          themes={theme}
        />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled(Cluster).attrs({ as: 'dl', gap: 1.5 })`
  margin-block: initial;
`

const Item = styled(DefinitionListItem)<{ themes: Theme; maxColumns: Props['maxColumns'] }>`
  ${({ maxColumns, themes: { space } }) => css`
    flex-grow: 1;
    ${maxColumns &&
    css`
      /* (全体幅 - (溝 * (最大列数 - 1)) / 最大列数 */
      flex-basis: calc((100% - ${space(1.5)} * ${maxColumns - 1}) / ${maxColumns});
    `}

    min-width: 12em;
    /* 最大列数を指定した場合は、理想的な max-width 以上に広がる可能性がある */
    ${!maxColumns &&
    css`
      max-width: 30em;
    `}
  `}
`
