'use client'

import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { registerChartComponents } from '../../config'
import { BarChart } from '../BarChart'
import { LineChart } from '../LineChart'

import type { ChartData, ChartOptions } from 'chart.js'

registerChartComponents()

type ChartType = 'bar' | 'line'

type Props = {
  [K in ChartType]: {
    type: K
    data: ChartData<K>
    title?: string
    className?: string
    options?: Partial<ChartOptions<K>>
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
const InnerChart: React.FC<Props> = (props) => {
  switch (props.type) {
    case 'bar':
      return <BarChart data={props.data} title={props.title} options={props.options} />
    case 'line':
      return <LineChart data={props.data} title={props.title} options={props.options} />
    default:
      return null
  }
}
