import React, { FC, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'
import { Theme, useTheme } from '../../hooks/useTheme'

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

const column = {
  single: 1,
  double: 2,
  triple: 3,
}

const Wrapper = styled.dl.attrs({ as: 'dl' })(() => {
  return css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
    gap: ${useSpacing(2.5)};
    margin-block: initial;
  `
})

const Item = styled(DefinitionListItem)<{ themes: Theme; layout: LayoutType }>`
  ${({ layout, themes: { space, size } }) => {
    const $columns = column[layout]
    const generateFlexBasis = (cols: number) =>
      `calc((100% - (${space(1.5)} * ${cols - 1})) / ${cols})`

    return css`
      flex-basis: ${generateFlexBasis($columns)};
      flex-shrink: 1;

      ${$columns > 2 &&
      css`
        @media (max-width: ${size.mediaQuery.TABLET}px) {
          flex-basis: ${generateFlexBasis(2)};
        }
      `}
      ${$columns > 1 &&
      css`
        @media (max-width: ${size.mediaQuery.SP}px) {
          flex-basis: ${generateFlexBasis(1)};
        }
      `}
    `
  }}
`
