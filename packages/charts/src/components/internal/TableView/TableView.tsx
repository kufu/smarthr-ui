import { Table, Td, Th } from 'smarthr-ui'
import { ChartData, ChartOptions, ChartType } from 'chart.js'
import { ReactNode } from 'react'


type ChartName = Exclude<ChartType, 'bubble' | 'scatter' | 'polarArea'>

type Props<T extends ChartName> = {
  data: ChartData<T>
  options: Partial<ChartOptions<T>>
}

type TableData = {
  headers: ReactNode[]
  dataRows: ReactNode[][]
}

// 1列目（見出し列）のみ幅を抑える
const FIRST_COLUMN_CLASS_NAME = [
  '[&>tbody>tr:first-child>th:first-child]:shr-min-w-[10rem] [&>tbody>tr:first-child>th:first-child]:shr-w-[1%] [&>tbody>tr:first-child>th:first-child]:shr-max-w-[24rem] [&>tbody>tr:first-child>th:first-child]:shr-whitespace-normal',
  '[&>tbody>tr>td:first-child]:shr-min-w-[10rem] [&>tbody>tr>td:first-child]:shr-w-[1%] [&>tbody>tr>td:first-child]:shr-max-w-[24rem]',
].join(' ')

export const TableView = <T extends ChartName>({
  data,
  options,
}: Props<T>) => {
  const generateTableData = (): TableData => {
    const xTitle = (options as Partial<ChartOptions<'bar' | 'line'>>).scales?.x?.title?.text

    return {
      headers: [xTitle ?? '', ...(data.datasets?.map((dataset) => dataset.label) ?? [])],
      dataRows:
        data.labels?.map((label, index) => [
          label as ReactNode,
          ...(data.datasets?.map((dataset) => dataset.data?.[index] as ReactNode) ?? []),
        ]) ?? [],
    }
  }

  const tableData = generateTableData()

  return (
    <div className="shr-py-0.5">
      <Table className={FIRST_COLUMN_CLASS_NAME}>
        <tbody>
          <tr>
            {tableData.headers.map((header, index) => (
              <Th key={`header-${index}`}>{header}</Th>
            ))}
          </tr>
          {tableData.dataRows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <Td key={`cell-${cellIndex}`}>{cell}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
