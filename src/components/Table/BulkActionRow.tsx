import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useBulkActionRowClassNames } from './useClassNames'
import { useTableHeadCellCount } from './useTableHeadCellCount'

export type Props = {
  /** 一括操作エリアの内容 */
  children?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>

export const BulkActionRow: FC<Props & ElementProps> = ({ className = '', children, ...props }) => {
  const themes = useTheme()
  const classNames = useBulkActionRowClassNames()

  const { countHeadCellRef, count } = useTableHeadCellCount<HTMLTableRowElement>()

  return (
    <tr {...props} ref={countHeadCellRef} className={`${className} ${classNames.wrapper}`}>
      <Cell colSpan={count} themes={themes}>
        {children}
      </Cell>
    </tr>
  )
}

const Cell = styled.td<{ themes: Theme }>(({ themes }) => {
  const { fontSize, border, color, space } = themes
  return css`
    border-top: ${border.shorthand};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${space(1)};
    font-size: ${fontSize.M};
  `
})
