import { ItemNode } from './ItemNode'
import { RootNode } from './RootNode'

describe('RootNode', () => {
  test('RootNodeを作る', () => {
    const child1 = new ItemNode('2', 'child1')
    const child2 = new ItemNode('3', 'child2')
    const root = new RootNode([child1, child2])

    expect(root.children).toEqual([child1, child2])
    expect(child1.parent).toEqual(root)
    expect(child2.parent).toEqual(root)
  })

  test('RootNodeLike から RootNode を作る', () => {
    const rootNodeLike = {
      children: [
        { value: '2', label: 'child1' },
        { value: '3', label: 'child2' },
      ],
    }
    const root = RootNode.from(rootNodeLike)

    expect(root.children).toEqual([new ItemNode('2', 'child1'), new ItemNode('3', 'child2')])
  })

  describe('getFirstChild', () => {
    test('最初の子ノードを取得する', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      const root = new RootNode([child1, child2])
      expect(root.getFirstChild()).toEqual(child1)
    })
  })

  describe('getLastChild', () => {
    test('最後の子ノードを取得する', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      const root = new RootNode([child1, child2])
      expect(root.getLastChild()).toEqual(child2)
    })
  })

  describe('findByValue', () => {
    test('value に一致する ItemNode を返す', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      const root = new RootNode([child1, child2])
      expect(root.findByValue('2')).toEqual(child1)
      expect(root.findByValue('3')).toEqual(child2)
    })

    test('value に一致する ItemNode が見つからない場合、undefined を返す', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      const root = new RootNode([child1, child2])
      expect(root.findByValue('1')).toBeUndefined()
    })
  })

  describe('toViewData', () => {
    const root = new RootNode([
      new ItemNode('level-1-1', '第一階層ほげ', [
        new ItemNode('level-2-1', '第二階層ふが', [
          new ItemNode('level-3-1', '第三階層ほげ'),
          new ItemNode('level-3-2', '第三階層ふが'),
          new ItemNode('level-3-3', '第三階層ぴん'),
          new ItemNode('level-3-4', '第三階層ぽん'),
        ]),
        new ItemNode('level-2-2', '第二階層ぽん'),
      ]),
      new ItemNode('level-1-2', '第一階層ふが'),
    ])

    test('第一階層を選択中の場合、第一階層と紐づく第二階層のオプションを表示用データの形式で返却する', () => {
      const viewData = root.toViewData('level-1-1')
      expect(viewData).toEqual([
        [new ItemNode('level-1-1', '第一階層ほげ'), new ItemNode('level-1-2', '第一階層ふが')],
        [new ItemNode('level-2-1', '第二階層ふが'), new ItemNode('level-2-2', '第二階層ぽん')],
      ])
    })

    test('第二階層を選択中の場合、第二階層と紐づく親階層および子階層のオプションを表示用データの形式で返却する', () => {
      const viewData = root.toViewData('level-2-1')
      expect(viewData).toEqual([
        [new ItemNode('level-1-1', '第一階層ほげ'), new ItemNode('level-1-2', '第一階層ふが')],
        [new ItemNode('level-2-1', '第二階層ふが'), new ItemNode('level-2-2', '第二階層ぽん')],
        [
          new ItemNode('level-3-1', '第三階層ほげ'),
          new ItemNode('level-3-2', '第三階層ふが'),
          new ItemNode('level-3-3', '第三階層ぴん'),
          new ItemNode('level-3-4', '第三階層ぽん'),
        ],
      ])
    })

    test('第三階層を選択中の場合、第三階層と紐づく親階層のオプションを表示用データの形式で返却する', () => {
      const viewData = root.toViewData('level-3-1')
      expect(viewData).toEqual([
        [new ItemNode('level-1-1', '第一階層ほげ'), new ItemNode('level-1-2', '第一階層ふが')],
        [new ItemNode('level-2-1', '第二階層ふが'), new ItemNode('level-2-2', '第二階層ぽん')],
        [
          new ItemNode('level-3-1', '第三階層ほげ'),
          new ItemNode('level-3-2', '第三階層ふが'),
          new ItemNode('level-3-3', '第三階層ぴん'),
          new ItemNode('level-3-4', '第三階層ぽん'),
        ],
      ])
    })

    test('value が指定されていない場合、root の children を返却する', () => {
      const viewData = root.toViewData()
      expect(viewData).toEqual([root.children])
    })

    test('value が見つからない場合、root の children を返却する', () => {
      const viewData = root.toViewData('not-found')
      expect(viewData).toEqual([root.children])
    })
  })
})
