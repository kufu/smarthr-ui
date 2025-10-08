import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { SpreadsheetTableCorner } from './SpreadsheetTableCorner'

type Props = PropsWithChildren<{
  data?: ReactNode[][]
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'table'>, keyof Props>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-SpreadsheetTable shr-border-shorthand shr-border-collapse shr-bg-head',
    // th
    '[&_th]:shr-p-0.25 [&_th]:shr-text-sm [&_th]:shr-font-normal [&_th]:shr-text-black',
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

export const SpreadsheetTable: FC<Props & ElementProps> = ({
  data,
  className,
  children,
  ...props
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <table {...props} className={actualClassName}>
      {data && (
        <>
          <MemoizedThead cols={data[0].length} />
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <th>{i + 1}</th>
                {row.map((cell, j) => (
                  <td key={`${i}-${j}`}>{cell}</td>
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

const MemoizedThead = memo<{ cols: number }>(({ cols }) => {
  const columns: ReactNode[] = []

  for (let i = 0; i < cols; i++) {
    columns.push(
      <th key={i}>
        {
          // アルファベットを A から自動挿入
          String.fromCharCode(65 + i)
        }
      </th>,
    )
  }

  return (
    <thead>
      <tr>
        <SpreadsheetTableCorner />
        {columns}
      </tr>
    </thead>
  )
})
