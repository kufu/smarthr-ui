import { merge } from './merge'

describe('merge', () => {
  it('targetとsourceを変更せず、新しいオブジェクトを返す', () => {
    const target = { a: 1, nested: { b: 2 } }
    const source = { nested: { c: 3 } }

    const actual = merge(target, source)

    expect(actual).toEqual({ a: 1, nested: { b: 2, c: 3 } })
    expect(target).toEqual({ a: 1, nested: { b: 2 } })
    expect(source).toEqual({ nested: { c: 3 } })
    expect(actual).not.toBe(target)
    expect(actual.nested).not.toBe(target.nested)
  })

  it('sourceの値が優先される', () => {
    expect(merge({ a: 1, b: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('値がundefinedのプロパティは無視される', () => {
    expect(merge({ a: 1, b: 1 }, { a: undefined, b: 2 })).toEqual({ a: 1, b: 2 })
  })

  it('sourceがnull・undefinedの場合は、targetのコピーを返す', () => {
    const target = { a: 1 }

    expect(merge(target, null)).toEqual({ a: 1 })
    expect(merge(target, undefined)).not.toBe(target)
  })

  it('プレーンオブジェクトでない値は再帰的にマージせず上書きする', () => {
    const fn = () => 'fn'

    expect(merge({ a: { b: 1 }, list: [1, 2, 3] }, { a: fn, list: [4] })).toEqual({
      a: fn,
      list: [4],
    })
  })
})
