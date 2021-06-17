import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { TableGroupContext } from './Table'
import { useClassNames } from './useClassNames'

export type Props = {
  bulkActionArea?: ReactNode
  children?: ReactNode
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLTableSectionElement>, keyof Props>

export const Head: VFC<Props & ElementProps> = ({
  bulkActionArea,
  className = '',
  children,
  ...props
}) => {
  const themes = useTheme()
  const classNames = useClassNames().head
  return (
    <thead {...props} className={`${className} ${classNames.wrapper}`}>
      <TableGroupContext.Provider value={{ group: 'head' }}>{children}</TableGroupContext.Provider>
      {bulkActionArea && (
        <tr className={classNames.bulkActionArea}>
          <BulkActionTD colSpan={1000} themes={themes}>
            {bulkActionArea}
          </BulkActionTD>
        </tr>
      )}
    </thead>
  )
}

const BulkActionTD = styled.td<{ themes: Theme }>(({ themes }) => {
  const { fontSize, frame, color, spacingByChar } = themes
  return css`
    border-top: ${frame.border.default};
    background-color: ${color.ACTION_BACKGROUND};
    padding: ${spacingByChar(1)};
    font-size: ${fontSize.M};
  `
})
