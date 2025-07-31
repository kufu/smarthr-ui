'use client'

import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { registerChartComponents } from '../../config'
import { BarChart } from '../BarChart'

import type { ChartData } from 'chart.js'

registerChartComponents()

type ChartType = 'bar'

type Props = {
  type: ChartType
  data: ChartData<ChartType>
  title: string
  className?: string
}

const classNameGenerator = tv({
  base: 'shr-h-[500px]',
})

export const Chart: React.FC<Props> = ({ type, data, title, className }) => {
  const classNames = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <div className={classNames}>
      <InnerChart type={type} data={data} title={title} />
    </div>
  )
}

const InnerChart: React.FC<Props> = ({ type, data, title }) => {
  switch (type) {
    case 'bar':
      return <BarChart data={data} title={title} />
    default:
      return null
  }
}
