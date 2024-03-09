import React, { ComponentPropsWithoutRef, PropsWithChildren, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { SpreadsheetTableCorner } from './SpreadsheetTableCorner'

type Props = PropsWithChildren<{
  data?: ReactNode[][]
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'table'>, keyof Props>

const spreadsheetTable = tv({
  base: [
    'smarthr-ui-SpreadsheetTable shr-border-shorthand shr-border-collapse shr-bg-head',
    // th
    '[&_th]:shr-p-0.25 [&_th]:shr-text-sm [&_th]:shr-font-normal [&_th]:shr-text-grey',
    // th + th
    '[&_th_+_th]:shr-border-l-shorthand [&_th_+_th]:shr-border-[theme(backgroundColor[head-darken])]',
    // 左上の角： tr:first-child th:first-child
    '[&_tr:first-child_th:first-child]:shr-w-[calc(1em_*_theme(lineHeight.normal))]',
    // tr + tr th
    '[&_tr_+_tr_th]:shr-border-t-shorthand [&_tr_+_tr_th]:shr-border-[theme(backgroundColor[head-darken])]',
    // td
    '[&_td]:shr-border-shorthand [&_td]:shr-bg-white [&_td]:shr-p-0.25 [&_td]:shr-text-sm',
  ],
})

export const SpreadsheetTable: React.FC<Props & ElementProps> = ({
  data,
  className,
  children,
  ...props
}) => {
  const style = useMemo(() => spreadsheetTable({ className }), [className])

  return (
    <table {...props} className={style}>
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
    </table>
  )
}
