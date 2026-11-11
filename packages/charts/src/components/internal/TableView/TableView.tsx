import { Table, Td, Th, VisuallyHiddenText } from 'smarthr-ui'

import type { ChartType as BaseChartType, ChartData, ChartOptions } from 'chart.js'
import type { ReactNode } from 'react'

type ChartType = Exclude<BaseChartType, 'bubble' | 'scatter' | 'polarArea'>

type Props<T extends ChartType> = {
  data: ChartData<T>
  options?: ChartOptions<T>
  /** 表のアクセシブルネーム。見出しはチャート側で表示しているので、caption は視覚的に隠す */
  caption?: string
}

// 1列目（見出し列）のみ幅を抑える
const FIRST_COLUMN_CLASS_NAME =
  '[&>tbody>tr:first-child>th:first-child]:shr-min-w-[10rem] [&>tbody>tr:first-child>th:first-child]:shr-w-[1%] [&>tbody>tr:first-child>th:first-child]:shr-whitespace-normal'

// 行見出しは白背景にする
const ROW_HEADER_CLASS_NAME = '[&_th:not([scope=col])]:shr-bg-white'

export const TableView = <T extends ChartType>({
  data,
  options,
  caption,
}: Props<T>) => {
  const { scales } = options as Partial<ChartOptions<'bar' | 'line'>>
  const headers: ReactNode[] = [
    options?.indexAxis === 'y' ? scales?.y?.title?.text : scales?.x?.title?.text,
    ...data.datasets.map((dataset) => dataset.label),
  ]
  const rows: ReactNode[][] = (data.labels ?? []).map((label, index) => [
    label as ReactNode,
    ...data.datasets.map((dataset) => dataset.data[index] as ReactNode),
  ])

  return (
    <div className="shr-mt-0.5 shr-h-full">
      <Table className={`${FIRST_COLUMN_CLASS_NAME} ${ROW_HEADER_CLASS_NAME}`}>
        {caption && <VisuallyHiddenText as="caption">{caption}</VisuallyHiddenText>}
        <tbody>
          <tr>
            {headers.map((header, index) => (
              <Th key={`header-${index}`} scope="col">
                {header}
              </Th>
            ))}
          </tr>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) =>
                cellIndex === 0 ? (
                  <Th key={`cell-${cellIndex}`} scope="row">
                    {cell}
                  </Th>
                ) : (
                  <Td key={`cell-${cellIndex}`}>{cell}</Td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
