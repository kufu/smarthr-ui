import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useBulkActionRowClassNames } from './useClassNames'

export type Props = {
  /** 一括操作エリアの内容 */
  children?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>

export const BulkActionRow: VFC<Props & ElementProps> = ({
  className = '',
  children,
  ...props
}) => {
  const themes = useTheme()
  const classNames = useBulkActionRowClassNames()
  return (
    <tr {...props} className={`${className} ${classNames.wrapper}`}>
      <Cell colSpan={1000} themes={themes}>
        {children}
      </Cell>
    </tr>
  )
}

const Cell = styled.td<{ themes: Theme }>(({ themes }) => {
  const { fontSize, border, color, spacingByChar } = themes
  return css`
    border-top: ${border.shorthand};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${fontSize.M};
  `
})
