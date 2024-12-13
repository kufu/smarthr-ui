import { Node } from './Node'
import { NodeContext } from './NodeContext'

const NODE_MAX_DEPTH = 3

export type ItemNodeLike = {
  value: string
  label: string
  children?: ItemNodeLike[]
}

export class ItemNode {
  readonly value: string
  readonly label: string
  readonly context: NodeContext<ItemNode, ItemNode>

  constructor(value: string, label: string, children: ItemNode[] = []) {
    this.value = value
    this.label = label
    this.context = new NodeContext(this)
    for (const child of children) {
      this.append(child)
    }
  }

  static from(item: ItemNodeLike): ItemNode {
    return new ItemNode(
      item.value,
      item.label,
      (item.children ?? []).map((itemNodeLike) => ItemNode.from(itemNodeLike)),
    )
  }

  get parent(): Node | undefined {
    return this.context.parent?.node
  }

  get children(): ItemNode[] {
    return this.context.children.map((child) => child.node)
  }

  append(that: ItemNode): void {
    if (this.#getDepth() >= NODE_MAX_DEPTH) {
      throw new Error(`Cannot append to a node deeper than ${NODE_MAX_DEPTH}`)
    }
    this.context.append(that.context)
  }

  getNext(): ItemNode | undefined {
    if (!this.parent) {
      return
    }
    const index = this.#getIndex()
    if (index === -1) {
      return
    }
    return this.parent.children[index + 1]
  }

  getPrev(): ItemNode | undefined {
    if (!this.parent) {
      return
    }
    const index = this.#getIndex()
    if (index === -1) {
      return
    }
    return this.parent.children[index - 1]
  }

  getFirstChild(): ItemNode | undefined {
    return this.children.at(0)
  }

  getLastChild(): ItemNode | undefined {
    return this.children.at(-1)
  }

  getAncestors(): ItemNode[] {
    const ancestors: ItemNode[] = []

    let current: Node | undefined = this.parent
    while (current instanceof ItemNode) {
      ancestors.unshift(current)
      current = current.parent
    }

    return ancestors
  }

  getSiblings(): ItemNode[] {
    if (!this.parent) {
      return []
    }
    return this.parent.children
  }

  findByValue(value: string): ItemNode | undefined {
    if (this.value === value) {
      return this
    }
    for (const child of this.children) {
      const found = child.findByValue(value)
      if (found) {
        return found
      }
    }
    return
  }

  #getIndex(): number {
    if (!this.parent) {
      return -1
    }
    return this.parent.children.indexOf(this)
  }

  #getDepth(): number {
    return this.getAncestors().length + 1
  }
}
