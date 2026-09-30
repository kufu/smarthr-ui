import { Table, Td, Th } from 'smarthr-ui'
import { ChartData, ChartOptions } from 'chart.js'
import { ReactNode } from 'react'

type Props<T extends 'doughnut' | 'bar' | 'radar' | 'pie' | 'line'> = {
  data: ChartData<T>
  options: Partial<ChartOptions<T>>
}

type TableData = {
  headers: ReactNode[]
  dataRows: ReactNode[][]
}

export const TableView = <T extends 'doughnut' | 'bar' | 'radar' | 'pie' | 'line'>({
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
      <Table>
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
