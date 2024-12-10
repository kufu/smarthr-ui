import { Node } from './Node'

export class NodeContext<T extends Node = Node, TChild extends Node = Node> {
  #parent?: NodeContext
  readonly node: T
  readonly #children: Array<NodeContext<TChild>>

  constructor(node: T, parent?: NodeContext, children: Array<NodeContext<TChild>> = []) {
    this.node = node
    this.#parent = parent
    this.#children = children
  }

  get children(): Array<NodeContext<TChild>> {
    return [...this.#children]
  }

  get parent(): NodeContext | undefined {
    return this.#parent
  }

  append(that: NodeContext<TChild>) {
    this.#children.push(that)
    that.#parent = this
  }
}
