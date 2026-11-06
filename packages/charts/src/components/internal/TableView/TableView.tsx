import { Table, Td, Th } from 'smarthr-ui'

import type { ChartType as BaseChartType, ChartData, ChartOptions } from 'chart.js'
import type { ReactNode } from 'react'

type ChartType = Exclude<BaseChartType, 'bubble' | 'scatter' | 'polarArea'>

type Props<T extends ChartType> = {
  data: ChartData<T>
  options?: ChartOptions<T>
  grouped?: boolean
  'aria-labelledby'?: string
}

// 1列目（見出し列）のみ幅を抑える
const FIRST_COLUMN_CLASS_NAME =
  '[&>tbody>tr:first-child>th:first-child]:shr-min-w-[10rem] [&>tbody>tr:first-child>th:first-child]:shr-w-[1%] [&>tbody>tr:first-child>th:first-child]:shr-whitespace-normal'

// 行見出しは白背景にする
const ROW_HEADER_CLASS_NAME = '[&_th:not([scope=col])]:shr-bg-white'

type TableProps<T extends ChartType> = Omit<Props<T>, 'grouped'>

export const TableView = <T extends ChartType>({ grouped, ...rest }: Props<T>) =>
  grouped ? <GroupedTableView {...rest} /> : <DefaultTableView {...rest} />

const DefaultTableView = <T extends ChartType>({
  data,
  options,
  'aria-labelledby': ariaLabelledby,
}: TableProps<T>) => {
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
      <Table
        className={`${FIRST_COLUMN_CLASS_NAME} ${ROW_HEADER_CLASS_NAME}`}
        aria-labelledby={ariaLabelledby}
      >
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

type Group = {
  category: ReactNode
  items: Array<{ name: ReactNode; value: ReactNode }>
}

// データセットは値のあるカテゴリの内訳として並べる
const GroupedTableView = <T extends ChartType>({
  data,
  options,
  'aria-labelledby': ariaLabelledby,
}: TableProps<T>) => {
  const { indexAxis, scales, plugins } = (options ?? {}) as Partial<ChartOptions<'bar'>>
  const [categoryAxis, valueAxis] =
    indexAxis === 'y' ? (['y', 'x'] as const) : (['x', 'y'] as const)
  // TODO: smarthr-ui-charts自身が翻訳プロバイダーを持ったら翻訳する
  const headers = [
    scales?.[categoryAxis]?.title?.text ?? 'グループ',
    plugins?.legend?.title?.text ?? 'カテゴリー',
    scales?.[valueAxis]?.title?.text ?? '値',
  ]

  const groups: Group[] = (data.labels ?? []).map((label, index) => ({
    category: label as ReactNode,
    items: data.datasets
      .map((dataset) => ({ name: dataset.label, value: dataset.data[index] as ReactNode }))
      .filter(({ value }) => value !== null && value !== undefined),
  }))

  return (
    <div className="shr-mt-0.5 shr-h-full">
      <Table className={ROW_HEADER_CLASS_NAME} aria-labelledby={ariaLabelledby}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <Th key={`header-${index}`} scope="col">
                {header}
              </Th>
            ))}
          </tr>
        </thead>
        {groups.map(
          ({ category, items }, groupIndex) =>
            items.length > 0 && (
              <tbody key={`group-${groupIndex}`}>
                {items.map(({ name, value }, itemIndex) => (
                  <tr key={`item-${itemIndex}`}>
                    {itemIndex === 0 && (
                      <Th scope="rowgroup" rowSpan={items.length} vAlign="baseline">
                        {category}
                      </Th>
                    )}
                    <Th scope="row">{name}</Th>
                    <Td>{value}</Td>
                  </tr>
                ))}
              </tbody>
            ),
        )}
      </Table>
    </div>
  )
}
