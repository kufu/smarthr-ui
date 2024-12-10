import { ItemNode } from './ItemNode'

describe('ItemNode', () => {
  describe('constructor / from', () => {
    test('コンストラクタで作る', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      const item = new ItemNode('1', 'item1', [child1, child2])

      expect(item.children).toHaveLength(2)
      expect(item.children[0]).toEqual(child1)
      expect(item.children[1]).toEqual(child2)
      expect(child1.parent).toEqual(item)
      expect(child2.parent).toEqual(item)
    })

    test('fromでItemNodeを作る', () => {
      const item = ItemNode.from({
        value: '1',
        label: 'item1',
        children: [
          { value: '2', label: 'child1' },
          { value: '3', label: 'child2' },
        ],
      })

      expect(item.children).toHaveLength(2)
      expect(item.children[0].value).toBe('2')
      expect(item.children[1].value).toBe('3')
    })
  })

  describe('append', () => {
    test('子ノードを追加する', () => {
      const item = new ItemNode('1', 'item1')
      const child = new ItemNode('2', 'child1')
      item.append(child)

      expect(item.children).toHaveLength(1)
      expect(item.children[0]).toEqual(child)
      expect(child.parent).toEqual(item)
    })

    test('子ノードが最大深さを超える場合はエラーを投げる', () => {
      const item = new ItemNode('1', 'item1')
      const child = new ItemNode('2', 'child1')
      const grandChild = new ItemNode('3', 'grandChild1')
      item.append(child)
      child.append(grandChild)
      const grandGrandChild = new ItemNode('4', 'grandGrandChild1')
      expect(() => grandChild.append(grandGrandChild)).toThrow()
    })
  })

  describe('getNext', () => {
    test('次のノードを取得する', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      new ItemNode('1', 'item1', [child1, child2])
      const next = child1.getNext()

      expect(next).toEqual(child2)
    })

    test('親が存在しない場合はundefinedを返す', () => {
      const child = new ItemNode('1', 'child1')
      expect(child.getNext()).toBeUndefined()
    })

    test('次のノードが存在しない場合はundefinedを返す', () => {
      const child1 = new ItemNode('2', 'child1')
      new ItemNode('1', 'item1', [child1])
      const next = child1.getNext()

      expect(next).toBeUndefined()
    })
  })

  describe('getPrev', () => {
    test('前のノードを取得する', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      new ItemNode('1', 'item1', [child1, child2])
      const prev = child2.getPrev()

      expect(prev).toEqual(child1)
    })

    test('親が存在しない場合はundefinedを返す', () => {
      const child = new ItemNode('1', 'child1')
      expect(child.getPrev()).toBeUndefined()
    })

    test('前のノードが存在しない場合はundefinedを返す', () => {
      const child1 = new ItemNode('2', 'child1')
      new ItemNode('1', 'item1', [child1])
      const prev = child1.getPrev()

      expect(prev).toBeUndefined()
    })
  })

  describe('getFirstChild', () => {
    test('最初の子ノードを取得する', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      const item = new ItemNode('1', 'item1', [child1, child2])
      expect(item.getFirstChild()).toBe(child1)
    })
  })

  describe('getLastChild', () => {
    test('最後の子ノードを取得する', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      const item = new ItemNode('1', 'item1', [child1, child2])
      expect(item.getLastChild()).toBe(child2)
    })
  })

  describe('getAncestors', () => {
    test('祖先を一覧する', () => {
      const item3 = new ItemNode('3', 'item3')
      const item2 = new ItemNode('2', 'item2', [item3])
      const item1 = new ItemNode('1', 'item1', [item2])
      const ancestors = item3.getAncestors()

      expect(ancestors).toEqual([item1, item2])
    })
  })

  describe('getSiblings', () => {
    test('兄弟を一覧する', () => {
      const child1 = new ItemNode('2', 'child1')
      const child2 = new ItemNode('3', 'child2')
      new ItemNode('1', 'item1', [child1, child2])
      const siblings = child2.getSiblings()

      expect(siblings).toEqual([child1, child2])
    })

    test('兄弟が居ない場合は空の配列を返す', () => {
      const item = new ItemNode('1', 'item1')
      const siblings = item.getSiblings()

      expect(siblings).toEqual([])
    })
  })

  describe('findByValue', () => {
    test('valueからノードを探索する', () => {
      const item3 = new ItemNode('3', 'item3')
      const item2 = new ItemNode('2', 'item2', [item3])
      const item1 = new ItemNode('1', 'item1', [item2])
      const item = item1.findByValue('3')
      expect(item).toEqual(item3)
    })

    test('ノードが見つからない場合はundefinedを返す', () => {
      const item3 = new ItemNode('3', 'item3')
      const item2 = new ItemNode('2', 'item2', [item3])
      const item1 = new ItemNode('1', 'item1', [item2])
      const item = item1.findByValue('4')
      expect(item).toBeUndefined()
    })
  })
})
