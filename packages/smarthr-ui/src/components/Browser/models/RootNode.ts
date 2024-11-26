import { ItemNode, ItemNodeLike } from './ItemNode'
import { NodeContext } from './NodeContext'

export type RootNodeLike = {
  children: ItemNodeLike[]
}

export class RootNode {
  readonly context: NodeContext<RootNode, ItemNode>

  constructor(children: ItemNode[]) {
    this.context = new NodeContext(this)
    for (const child of children) {
      this.append(child)
    }
  }

  static from(rootNodeLike: RootNodeLike) {
    return new RootNode(rootNodeLike.children.map((itemNodeLike) => ItemNode.from(itemNodeLike)))
  }

  get children(): ItemNode[] {
    return this.context.children.map((child) => child.node)
  }

  append(that: ItemNode) {
    this.context.append(that.context)
  }

  getFirstChild(): ItemNode | undefined {
    return this.children.at(0)
  }

  getLastChild(): ItemNode | undefined {
    return this.children.at(-1)
  }

  findByValue(value: string): ItemNode | undefined {
    for (const child of this.children) {
      const found = child.findByValue(value)
      if (found) {
        return found
      }
    }
    return
  }

  toViewData(value?: string): ItemNode[][] {
    if (this.children.length <= 0) {
      return []
    }

    if (!value) {
      return [this.children]
    }

    const pivot = this.findByValue(value)
    if (!pivot) {
      return [this.children]
    }

    const viewData = [
      ...pivot.getAncestors().map((ancestor) => ancestor.getSiblings()),
      pivot.getSiblings(),
    ]

    if (pivot.children.length > 0) {
      viewData.push(pivot.children)
    }

    return viewData
  }
}
