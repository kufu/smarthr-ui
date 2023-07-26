import React, { PropsWithChildren, ReactNode, TableHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { SpreadsheetTableCorner } from './SpreadsheetTableCorner'

type Props = PropsWithChildren<{
  data?: ReactNode[][]
}>
type ElementProps = Omit<TableHTMLAttributes<HTMLTableElement>, keyof Props>

export const SpreadsheetTable: React.FC<Props & ElementProps> = ({
  data,
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  return (
    <Wrapper {...props} themes={theme} className={`smarthr-ui-SpreadsheetTable ${className}`}>
      {data && (
        <>
          <thead>
            <tr>
              <SpreadsheetTableCorner />
              {data[0].map((_, i) => (
                <th key={`headRow-${i}`}>
                  {/* アルファベットを A から自動挿入 */}
                  {String.fromCharCode(65 + i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={`bodyRow-${i}`}>
                <th>{i + 1}</th>
                {row.map((cell, j) => (
                  <td key={`bodyCell-${i}-${j}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </>
      )}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.table<{ themes: Theme }>`
  ${({ themes: { border, color, fontSize, leading, space } }) => css`
    border-collapse: collapse;
    border: ${border.shorthand};
    background-color: ${color.HEAD};

    th,
    td {
      padding: ${space(0.25)};
      font-size: ${fontSize.S};
    }

    th {
      font-weight: normal;
      color: ${color.TEXT_GREY};
    }

    th + th {
      border-inline-start: 1px solid ${color.hoverColor(color.HEAD)};
    }

    tr + tr th {
      border-block-start: 1px solid ${color.hoverColor(color.HEAD)};
      width: calc(1em * ${leading.NORMAL});
    }

    td {
      border: ${border.shorthand};
      background-color: ${color.WHITE};
    }
  `}
`
