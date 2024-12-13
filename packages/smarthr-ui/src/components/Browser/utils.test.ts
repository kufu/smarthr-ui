import { ItemNode } from './models'
import { getElementIdFromNode } from './utils'

test('getElementIdFromNode', () => {
  const node = new ItemNode('value', 'label')
  expect(getElementIdFromNode(node)).toBe('radio-value')
})
