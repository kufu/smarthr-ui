'use client'

import { registerChartComponents } from '../../config'
import { BarChart } from '../BarChart'

import type { ChartData } from 'chart.js'

// Chart.jsのコンポーネントをモジュールレベルで登録
registerChartComponents()

type ChartType = 'bar'

type Props = {
  type: ChartType
  data: ChartData<ChartType>
  title: string
}

export const Chart: React.FC<Props> = ({ type, data, title }) => {
  switch (type) {
    case 'bar':
      return <BarChart data={data} title={title} />
    default:
      return null
  }
}
