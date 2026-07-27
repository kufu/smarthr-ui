import { describe, expect, it } from 'vitest'

import { diffRemovedSrcs } from './collectImageSrcs'

describe('diffRemovedSrcs', () => {
  it('after に無くなった src を返す', () => {
    expect(diffRemovedSrcs(['a', 'b'], ['a'])).toEqual(['b'])
  })

  it('変化なしなら空配列', () => {
    expect(diffRemovedSrcs(['a'], ['a'])).toEqual([])
  })

  it('重複のうち1つが消えた場合は1つだけ返す', () => {
    expect(diffRemovedSrcs(['a', 'a'], ['a'])).toEqual(['a'])
  })

  it('並び替え(移動)は正味削除なしとして空配列', () => {
    expect(diffRemovedSrcs(['a', 'b'], ['b', 'a'])).toEqual([])
  })

  it('全削除はその src を返す', () => {
    expect(diffRemovedSrcs(['a'], [])).toEqual(['a'])
  })

  it('純粋な追加は空配列', () => {
    expect(diffRemovedSrcs([], ['a'])).toEqual([])
  })

  it('同一 src が削除かつ再追加（数が同じ）なら空配列', () => {
    expect(diffRemovedSrcs(['a', 'b'], ['b', 'a'])).toEqual([])
  })

  it('複数の異なる src が同時に消えた場合はすべて返す', () => {
    expect(diffRemovedSrcs(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c'])
  })
})
