import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { TableGroupContext } from './Table'

export type Props = {
  bulkActionArea?: ReactNode
  children?: ReactNode
  className?: string
  fixed?: boolean
}

export const Head: VFC<Props> = ({ bulkActionArea, className = '', fixed = false, children }) => {
  const themes = useTheme()
  return (
    <StyledThead className={className} $fixed={fixed}>
      <TableGroupContext.Provider value={{ group: 'head' }}>{children}</TableGroupContext.Provider>
      {bulkActionArea && (
        <tr>
          <BulkActionTD colSpan={1000} themes={themes}>
            {bulkActionArea}
          </BulkActionTD>
        </tr>
      )}
    </StyledThead>
  )
}

const StyledThead = styled.thead<{ $fixed: boolean }>(({ $fixed }) => {
  return (
    $fixed &&
    css`
      position: sticky;
      top: 0;
      left: 0;
      z-index: 1;
    `
  )
})

const BulkActionTD = styled.td<{ themes: Theme }>(({ themes }) => {
  const { fontSize, frame, color, spacingByChar } = themes
  return css`
    border-top: ${frame.border.default};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${fontSize.M};
  `
})
