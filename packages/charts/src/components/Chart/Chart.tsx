'use client'

import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { registerChartComponents } from '../../config'
import { BarChart } from '../BarChart'
import { LineChart } from '../LineChart'

import type { ChartData } from 'chart.js'

registerChartComponents()

type ChartType = 'bar' | 'line'

type Props = {
  [K in ChartType]: {
    type: K
    data: ChartData<K>
    title: string
    className?: string
  }
}[ChartType]

const classNameGenerator = tv({
  base: 'shr-h-[500px]',
})

export const Chart: React.FC<Props> = ({ className, ...props }) => {
  const classNames = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <div className={classNames}>
      <InnerChart {...props} />
    </div>
  )
}
const InnerChart: React.FC<Props> = ({ type, data, ...props }) => {
  switch (type) {
    case 'bar':
      return <BarChart {...props} data={data} />
    case 'line':
      return <LineChart {...props} data={data} />
    default:
      return null
  }
}
