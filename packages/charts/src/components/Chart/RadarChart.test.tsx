import { describe, vi } from 'vitest'

import { testViewToggle } from '../internal/testing/testViewToggle'

import { RadarChart } from './RadarChart'

// jsdomにCanvasがないため、グラフ描画をモックする
vi.mock('react-chartjs-2', () => ({ Radar: () => null }))

const data = {
  labels: ['項目A', '項目B'],
  datasets: [{ label: '系列1', data: [1, 2] }],
}

describe('RadarChart', () => {
  testViewToggle((onChangeView) => <RadarChart data={data} onChangeView={onChangeView} />)
})
