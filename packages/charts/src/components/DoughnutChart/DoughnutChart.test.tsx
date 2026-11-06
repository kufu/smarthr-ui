import { describe, vi } from 'vitest'

import { testViewToggle } from '../internal/testing/testViewToggle'

import { DoughnutChart } from './DoughnutChart'

// jsdomにCanvasがないため、グラフ描画をモックする
vi.mock('react-chartjs-2', () => ({ Doughnut: () => null }))

const data = {
  labels: ['項目A', '項目B'],
  datasets: [{ label: '系列1', data: [1, 2] }],
}

describe('DoughnutChart', () => {
  testViewToggle((onChangeView) => <DoughnutChart data={data} disablePatterns onChangeView={onChangeView} />)
})
