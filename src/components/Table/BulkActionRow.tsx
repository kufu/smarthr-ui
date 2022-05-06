import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useBulkActionRowCalssNames } from './useClassNames'

export type Props = {
  children?: ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLTableRowElement>, keyof Props>

export const BulkActionRow: VFC<Props & ElementProps> = ({
  className = '',
  children,
  ...props
}) => {
  const themes = useTheme()
  const classNames = useBulkActionRowCalssNames()
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
