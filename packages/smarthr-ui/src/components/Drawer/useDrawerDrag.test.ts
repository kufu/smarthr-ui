import { resolveDragEnd } from './useDrawerDrag'

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
