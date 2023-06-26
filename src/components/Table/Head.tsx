import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { TableGroupContext } from './Table'
import { useClassNames } from './useClassNames'

export type Props = {
  bulkActionArea?: ReactNode
  children?: ReactNode
  className?: string
  fixed?: boolean
}
type ElementProps = Omit<HTMLAttributes<HTMLTableSectionElement>, keyof Props>

/**
 * @deprecated Head コンポーネントは非推奨です。thead 要素に置き換えてください。
 * thead 部分を固定表示する場合は Table コンポーネントの fixedHead Props を指定してください。
 * bulkActionArea を使う場合は BulkActionRow コンポーネントを使用してください。
 */
export const Head: VFC<Props & ElementProps> = ({
  bulkActionArea,
  className = '',
  fixed = false,
  children,
  ...props
}) => {
  const themes = useTheme()
  const classNames = useClassNames().head
  return (
    <StyledThead {...props} className={className} themes={themes} $fixed={fixed}>
      <TableGroupContext.Provider value={{ group: 'head' }}>{children}</TableGroupContext.Provider>
      {bulkActionArea && (
        <tr className={classNames.bulkActionArea}>
          <BulkActionTD colSpan={1000} themes={themes}>
            {bulkActionArea}
          </BulkActionTD>
        </tr>
      )}
    </StyledThead>
  )
}

const StyledThead = styled.thead<{ themes: Theme; $fixed: boolean }>(({ themes, $fixed }) => {
  const { zIndex } = themes

  return (
    $fixed &&
    css`
      position: sticky;
      top: 0;
      left: 0;
      z-index: ${zIndex.FIXED_MENU}; /* zIndexの値はセマンティックトークンとして管理しているため、明示的に値を指定しないと重なり順が崩れるため設定しています */
    `
  )
})

const BulkActionTD = styled.td<{ themes: Theme }>(({ themes }) => {
  const { fontSize, border, color, spacingByChar } = themes
  return css`
    border-top: ${border.shorthand};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${fontSize.M};
  `
})
