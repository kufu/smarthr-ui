import { describe, vi } from 'vitest'

import { testViewToggle } from '../internal/testing/testViewToggle'

import { LineChart } from './LineChart'

// jsdomにCanvasがないため、グラフ描画をモックする
vi.mock('react-chartjs-2', () => ({ Line: () => null }))

const data = {
  labels: ['項目A', '項目B'],
  datasets: [{ label: '系列1', data: [1, 2] }],
}

describe('LineChart', () => {
  testViewToggle((onChangeView) => <LineChart data={data} onChangeView={onChangeView} />)
})
