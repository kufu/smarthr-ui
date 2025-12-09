import { createShadow } from '../createShadow'

describe('createShadow', () => {
  it('デフォルトのシャドウが返されること', () => {
    const actual = createShadow()
    expect(actual.LAYER0).toBe('none')
    expect(actual.LAYER1).toBe('0 1px 2px 0 rgba(3,3,2,0.3)')
    expect(actual.LAYER2).toBe('0 2px 4px 1px rgba(3,3,2,0.3)')
    expect(actual.LAYER3).toBe('0 4px 8px 2px rgba(3,3,2,0.3)')
    expect(actual.LAYER4).toBe('0 8px 16px 4px rgba(3,3,2,0.3)')
  })
})
