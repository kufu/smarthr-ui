import { drawerSize } from './drawerSize'

describe('drawerSize', () => {
  it('S/M/L/FULL のキーを持つこと', () => {
    expect(Object.keys(drawerSize)).toEqual(['S', 'M', 'L', 'FULL'])
  })
  it('各値が shr- プレフィックスの幅クラスであること', () => {
    expect(drawerSize.S).toBe('shr-w-col4')
    expect(drawerSize.M).toBe('shr-w-col6')
    expect(drawerSize.L).toBe('shr-w-col8')
    expect(drawerSize.FULL).toBe('shr-w-full')
  })
})
