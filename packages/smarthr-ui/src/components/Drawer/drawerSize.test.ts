import { dialogSize } from '../../tailwind'

import { drawerSize } from './drawerSize'

describe('drawerSize', () => {
  it('S/M/L/FULL のキーを持つこと', () => {
    expect(Object.keys(drawerSize)).toEqual(['S', 'M', 'L', 'FULL'])
  })

  it('同じラベルで dialogSize と同じ幅になること', () => {
    expect(drawerSize.S).toBe(dialogSize.S)
    expect(drawerSize.M).toBe(dialogSize.M)
    expect(drawerSize.L).toBe(dialogSize.L)
    expect(drawerSize.FULL).toBe(dialogSize.FULL)
  })
})
