import { describe, expect, it } from 'vitest'

import { hitTestExtendedTableArea } from './extendedHitArea'

// テーブルが (100, 100) 始点、幅 200, 高さ 150 にある想定。バー太さ 24。
const baseRect = { top: 100, left: 100, width: 200, height: 150 }
const thickness = 24

describe('hitTestExtendedTableArea', () => {
  it('returns inside=true, both bar flags=false for point inside table proper', () => {
    expect(hitTestExtendedTableArea({ x: 150, y: 150 }, baseRect, thickness)).toEqual({
      inside: true,
      inRightBar: false,
      inBottomBar: false,
    })
  })

  it('returns inRightBar=true for point in right bar area (x > tableRight, y in table vertical range)', () => {
    // table.right = 300、右バー領域は x in (300, 324], y in [100, 250]
    expect(hitTestExtendedTableArea({ x: 310, y: 150 }, baseRect, thickness)).toEqual({
      inside: true,
      inRightBar: true,
      inBottomBar: false,
    })
  })

  it('returns inBottomBar=true for point in bottom bar area (y > tableBottom, x in table horizontal range)', () => {
    // table.bottom = 250、下バー領域は y in (250, 274], x in [100, 300]
    expect(hitTestExtendedTableArea({ x: 150, y: 260 }, baseRect, thickness)).toEqual({
      inside: true,
      inRightBar: false,
      inBottomBar: true,
    })
  })

  it('returns both bar flags=true for point in bottom-right corner extended area (overlap zone)', () => {
    // 角の交差ゾーン: x > tableRight && y > tableBottom (corner zone is shared so移動中flickerしない)
    expect(hitTestExtendedTableArea({ x: 310, y: 260 }, baseRect, thickness)).toEqual({
      inside: true,
      inRightBar: true,
      inBottomBar: true,
    })
  })

  it('returns inside=false, both flags=false for point well outside', () => {
    expect(hitTestExtendedTableArea({ x: 50, y: 50 }, baseRect, thickness)).toEqual({
      inside: false,
      inRightBar: false,
      inBottomBar: false,
    })
  })

  it('returns inside=false for point just past the right bar (x > 324)', () => {
    expect(hitTestExtendedTableArea({ x: 325, y: 150 }, baseRect, thickness)).toEqual({
      inside: false,
      inRightBar: false,
      inBottomBar: false,
    })
  })

  it('returns inside=false for point just past the bottom bar (y > 274)', () => {
    expect(hitTestExtendedTableArea({ x: 150, y: 275 }, baseRect, thickness)).toEqual({
      inside: false,
      inRightBar: false,
      inBottomBar: false,
    })
  })

  it('treats the top edge of the table as inside (inside table proper)', () => {
    expect(hitTestExtendedTableArea({ x: 150, y: 100 }, baseRect, thickness)).toEqual({
      inside: true,
      inRightBar: false,
      inBottomBar: false,
    })
  })

  it('treats the left edge of the table as inside (inside table proper)', () => {
    expect(hitTestExtendedTableArea({ x: 100, y: 150 }, baseRect, thickness)).toEqual({
      inside: true,
      inRightBar: false,
      inBottomBar: false,
    })
  })

  it('treats the right edge of the table (x === tableRight) as inside table proper (not in right bar)', () => {
    // 境界 x === tableRight は table 側
    expect(hitTestExtendedTableArea({ x: 300, y: 150 }, baseRect, thickness)).toEqual({
      inside: true,
      inRightBar: false,
      inBottomBar: false,
    })
  })
})
