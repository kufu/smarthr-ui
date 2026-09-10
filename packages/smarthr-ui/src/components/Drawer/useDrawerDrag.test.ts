import { resolveSnap } from './useDrawerDrag'

describe('resolveSnap', () => {
  const snapPoints = [200, 480, 800] // px 昇順

  it('速度ほぼ0なら投影位置に最も近いスナップに吸着する', () => {
    expect(resolveSnap({ snapPoints, currentSize: 460, velocity: 0, closeThreshold: 0.5 })).toEqual(
      {
        type: 'snap',
        index: 1,
      },
    )
    expect(resolveSnap({ snapPoints, currentSize: 780, velocity: 0, closeThreshold: 0.5 })).toEqual(
      {
        type: 'snap',
        index: 2,
      },
    )
  })

  it('最小スナップの半分を下回る位置なら閉じる', () => {
    expect(resolveSnap({ snapPoints, currentSize: 80, velocity: 0, closeThreshold: 0.5 })).toEqual({
      type: 'close',
    })
  })

  it('最小スナップ以下で閉じ方向に強くフリックしたら閉じる', () => {
    expect(
      resolveSnap({ snapPoints, currentSize: 180, velocity: -1.2, closeThreshold: 0.5 }),
    ).toEqual({ type: 'close' })
  })

  it('開く方向の速度は投影位置を引き上げ、上のスナップへ吸着する', () => {
    expect(
      resolveSnap({ snapPoints, currentSize: 460, velocity: 2.0, closeThreshold: 0.5 }),
    ).toEqual({ type: 'snap', index: 2 })
  })

  it('単一スナップ（横方向）: 半分以上残っていれば全開にスナップバック', () => {
    expect(
      resolveSnap({ snapPoints: [400], currentSize: 300, velocity: 0, closeThreshold: 0.5 }),
    ).toEqual({
      type: 'snap',
      index: 0,
    })
  })

  it('単一スナップ（横方向）: 半分未満なら閉じる', () => {
    expect(
      resolveSnap({ snapPoints: [400], currentSize: 150, velocity: 0, closeThreshold: 0.5 }),
    ).toEqual({
      type: 'close',
    })
  })
})
