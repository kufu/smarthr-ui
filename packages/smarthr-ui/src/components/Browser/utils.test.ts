import { getElementIdFromNode } from './utils'

test('getElementIdFromNode', () => {
  expect(getElementIdFromNode('VALUE')).toBe('radio-VALUE')
})
