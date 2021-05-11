import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { TableGroupContext } from './Table'

export type Props = {
  bulkActionArea?: ReactNode
  children?: ReactNode
  className?: string
}

export const Head: FC<Props> = ({ bulkActionArea, className = '', children }) => {
  const themes = useTheme()
  return (
    <thead className={className}>
      <TableGroupContext.Provider value={{ group: 'head' }}>{children}</TableGroupContext.Provider>
      {bulkActionArea && (
        <tr>
          <BulkActionTD colSpan={1000} themes={themes}>
            {bulkActionArea}
          </BulkActionTD>
        </tr>
      )}
    </thead>
  )
}

const BulkActionTD = styled.td<{ themes: Theme }>(({ themes }) => {
  const { frame, color, spacingByChar } = themes
  const { font, pxToRem } = themes.size
  return css`
    border-top: ${frame.border.default};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${pxToRem(font.TALL)};
  `
})
