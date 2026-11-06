import { dialogSize } from '../../tailwind'

import { drawerSize } from './drawerSize'

describe('drawerSize', () => {
  // dialogSize との一致だけだと、両方が同じ方向に変わったときに気づけない
  it('ラベルごとに固定の幅トークンを返すこと', () => {
    expect(drawerSize).toEqual({
      XS: 'shr-w-col3',
      S: 'shr-w-col4',
      M: 'shr-w-col5',
      L: 'shr-w-col6',
      XL: 'shr-w-col7',
      XXL: 'shr-w-col8',
      FULL: 'shr-w-full',
    })
  })

  it('同じラベルで dialogSize と同じ幅になること', () => {
    for (const [label, width] of Object.entries(drawerSize)) {
      expect(width).toBe(dialogSize[label as keyof typeof dialogSize])
    }
  })
})
