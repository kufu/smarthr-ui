import React, { FC, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'

import { DefinitionListItem, DefinitionListItemProps } from './DefinitionListItem'
import { useClassNames } from './useClassNames'

type LayoutType = 'default' | 'single' | 'double' | 'triple'
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
  layout = 'default',
  className = '',
}) => {
  const classNames = useClassNames()

  return (
    <Wrapper layout={layout} className={`${className} ${classNames.definitionList.wrapper}`}>
      {items.map(({ term, description, className: itemClassName }, index) => (
        <DefinitionListItem
          term={term}
          description={description}
          key={index}
          className={itemClassName}
        />
      ))}
    </Wrapper>
  )
}

/** layput 別のカラム数 */
const column = {
  default: 0,
  single: 1,
  double: 2,
  triple: 3,
}

const Wrapper = styled.dl<{ layout: LayoutType }>(({ layout }) => {
  const repeat = column[layout] ? column[layout] : 'auto-fill'
  const width = column[layout] ? '1fr' : 'minmax(16em, 1fr)'
  return css`
    display: grid;
    grid-template-columns: repeat(${repeat}, ${width});
    gap: ${useSpacing(1.5)};
  `
})
