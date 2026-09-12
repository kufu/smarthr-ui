import { dialogSize } from '../../tailwind'

import { drawerSize } from './drawerSize'

describe('drawerSize', () => {
  it('S/M/L/FULL のキーを持つこと', () => {
    expect(Object.keys(drawerSize)).toEqual(['S', 'M', 'L', 'FULL'])
  })

  // dialogSize との一致だけだと、両方が同じ方向に変わったときに気づけない
  it('ラベルごとに固定の幅トークンを返すこと', () => {
    expect(drawerSize).toEqual({
      S: 'shr-w-col4',
      M: 'shr-w-col5',
      L: 'shr-w-col6',
      FULL: 'shr-w-full',
    })
  })

  it('同じラベルで dialogSize と同じ幅になること', () => {
    expect(drawerSize.S).toBe(dialogSize.S)
    expect(drawerSize.M).toBe(dialogSize.M)
    expect(drawerSize.L).toBe(dialogSize.L)
    expect(drawerSize.FULL).toBe(dialogSize.FULL)
  })
})
