import { decayVelocity, resolveDragEnd } from './useDrawerDrag'

describe('resolveDragEnd', () => {
  const fullSize = 800

  it('速度ほぼ0で半分以上残っていれば開いたままにする', () => {
    expect(
      resolveDragEnd({ fullSize, currentSize: 600, velocity: 0, closeThreshold: 0.5 }),
    ).toEqual({ type: 'open' })
  })

  it('速度ほぼ0で半分未満まで縮んでいれば閉じる', () => {
    expect(
      resolveDragEnd({ fullSize, currentSize: 300, velocity: 0, closeThreshold: 0.5 }),
    ).toEqual({ type: 'close' })
  })

  it('閉じ方向に強くフリックしたら位置によらず閉じる', () => {
    expect(
      resolveDragEnd({ fullSize, currentSize: 780, velocity: -1.2, closeThreshold: 0.5 }),
    ).toEqual({ type: 'close' })
  })

  it('閉じ方向でも閾値未満の速度なら位置で判定する', () => {
    expect(
      resolveDragEnd({ fullSize, currentSize: 780, velocity: -0.2, closeThreshold: 0.5 }),
    ).toEqual({ type: 'open' })
  })

  it('開く方向の速度は投影位置を引き上げ、閉じ判定を打ち消す', () => {
    expect(
      resolveDragEnd({ fullSize, currentSize: 380, velocity: 2.0, closeThreshold: 0.5 }),
    ).toEqual({ type: 'open' })
  })
})

describe('decayVelocity', () => {
  it('動かした直後に離せば観測した速度をそのまま使う', () => {
    expect(decayVelocity({ velocity: -2, idleMs: 0, decayMs: 100 })).toBe(-2)
  })

  it('減衰時間の途中で離せば速度が比例して弱まる', () => {
    expect(decayVelocity({ velocity: -2, idleMs: 50, decayMs: 100 })).toBe(-1)
  })

  it('減衰時間を過ぎて静止していれば速度は 0 になる', () => {
    expect(decayVelocity({ velocity: -2, idleMs: 100, decayMs: 100 })).toBe(-0)
    expect(decayVelocity({ velocity: -2, idleMs: 400, decayMs: 100 })).toBe(-0)
  })
})
