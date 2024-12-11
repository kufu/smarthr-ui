import { ItemNode } from './models'

export const getElementIdFromNode = (node: ItemNode) => `radio-${node.value}`
