import { Fragment, type NodeType, type Node as PMNode, type Schema } from '@tiptap/pm/model'
import { StepMap } from '@tiptap/pm/transform'

import { type ConversionShape, LIST_NODE_NAMES } from '../blockCatalog'

import type { BlockRange } from './blockRange'

export type ConversionPlan =
  | { type: 'unavailable' }
  | { type: 'current' }
  | { type: 'convert'; from: number; to: number; content: Fragment; positionMap: StepMap }

const SEE_THROUGH: readonly string[] = [...LIST_NODE_NAMES, 'listItem', 'blockquote']

type Line = { type: 'line'; content: Fragment; source: PMNode }
type Carried = { type: 'carried'; node: PMNode; source: PMNode | null }
type Fixed = { type: 'fixed'; node: PMNode }

const isList = (node: PMNode) => (LIST_NODE_NAMES as readonly string[]).includes(node.type.name)

const isFixed = (node: PMNode) => !node.isTextblock && !SEE_THROUGH.includes(node.type.name)

const linesOf = (node: PMNode): Line[] =>
  node.type.name === 'codeBlock'
    ? node.textContent.split('\n').map((text) => ({
        type: 'line',
        content: text ? Fragment.from(node.type.schema.text(text)) : Fragment.empty,
        source: node,
      }))
    : [{ type: 'line', content: node.content, source: node }]

const flatten = (node: PMNode): Array<Line | Fixed> => {
  if (node.isTextblock) return linesOf(node)
  if (isFixed(node)) return [{ type: 'fixed', node }]

  return node.children.flatMap(flatten)
}

const flattenForList = (node: PMNode): Array<Line | Carried | Fixed> => {
  if (isList(node)) {
    return node.children.map((item): Carried => ({ type: 'carried', node: item, source: node }))
  }

  if (node.type.name === 'blockquote') return node.children.flatMap(flattenForList)

  return flatten(node)
}

const unwrapForBlockquote = (node: PMNode): Array<Carried | Fixed> => {
  if (node.type.name === 'blockquote') {
    return node.children.map((child): Carried => ({ type: 'carried', node: child, source: node }))
  }

  return [isFixed(node) ? { type: 'fixed', node } : { type: 'carried', node, source: null }]
}

const runsOf = <T extends Line | Carried>(pieces: ReadonlyArray<T | Fixed>) => {
  const runs: Array<Fixed | T[]> = []

  for (const piece of pieces) {
    const last = runs[runs.length - 1]

    if (piece.type === 'fixed') runs.push(piece)
    else if (Array.isArray(last)) last.push(piece)
    else runs.push([piece])
  }

  return runs
}

// 引き継ぐ属性を名前で並べないのは、型に属性を足したときに一覧の直し忘れで黙って落ちるため
const inheritAttrs = (type: NodeType, sources: ReadonlyArray<PMNode | null>) => {
  const attrs: Record<string, unknown> = {}

  for (const name of Object.keys(type.spec.attrs ?? {})) {
    const source = sources.find((node) => node && name in node.attrs)

    if (source) attrs[name] = source.attrs[name]
  }

  return attrs
}

const textblockOf = (type: NodeType, line: Line, attrs: Record<string, unknown> = {}) =>
  type.create({ ...inheritAttrs(type, [line.source]), ...attrs }, line.content)

const build = (fragment: Fragment, shape: ConversionShape, schema: Schema): PMNode[] => {
  switch (shape.type) {
    case 'textblock': {
      const type = schema.nodes[shape.nodeName]
      const attrs = shape.nodeName === 'heading' ? { level: shape.level } : {}

      return fragment.content
        .flatMap(flatten)
        .map((piece) => (piece.type === 'line' ? textblockOf(type, piece, attrs) : piece.node))
    }
    case 'codeBlock': {
      const type = schema.nodes.codeBlock

      return runsOf(fragment.content.flatMap(flatten)).map((run) => {
        if (!Array.isArray(run)) return run.node

        const text = run
          .map(({ content }) => content.textBetween(0, content.size, '', '\n'))
          .join('\n')

        return type.create(
          inheritAttrs(
            type,
            run.map(({ source }) => source),
          ),
          text ? schema.text(text) : null,
        )
      })
    }
    case 'list': {
      const type = schema.nodes[shape.nodeName]

      return runsOf(fragment.content.flatMap(flattenForList)).map((run) => {
        if (!Array.isArray(run)) return run.node

        const [first] = run

        return type.create(
          // 並びの途中のリストからは引き継がない。開始番号を先頭へ持ち上げると、前に足した行の分だけ元の項目の番号がずれるため
          inheritAttrs(type, [first.type === 'carried' ? first.source : null]),
          run.map((piece) =>
            piece.type === 'carried'
              ? piece.node
              : schema.nodes.listItem.create(null, textblockOf(schema.nodes.paragraph, piece)),
          ),
        )
      })
    }
    case 'blockquote': {
      const type = schema.nodes.blockquote

      return runsOf(fragment.content.flatMap(unwrapForBlockquote)).map((run) =>
        Array.isArray(run)
          ? type.create(
              inheritAttrs(
                type,
                run.map(({ source }) => source),
              ),
              run.map(({ node }) => node),
            )
          : run.node,
      )
    }
  }
}

const joinAdjacentLists = (doc: PMNode, range: BlockRange, nodes: PMNode[], type: NodeType) => {
  const before = range.startIndex > 0 ? doc.child(range.startIndex - 1) : null
  const after = range.endIndex < doc.childCount ? doc.child(range.endIndex) : null
  const joined = [...nodes]
  const last = joined.length - 1
  let { from, to } = range

  if (before?.type === type && joined[0].type === type) {
    joined[0] = type.create(before.attrs, before.content.append(joined[0].content))
    from -= before.nodeSize
  }

  if (after?.type === type && joined[last].type === type) {
    joined[last] = type.create(joined[last].attrs, joined[last].content.append(after.content))
    to += after.nodeSize
  }

  return { from, to, content: Fragment.from(joined) }
}

type Unit = { type: 'text' | 'node'; from: number; to: number }

const readUnits = (fragment: Fragment, start: number, units: Unit[] = []) => {
  fragment.forEach((node, offset) => {
    const pos = start + offset

    if (node.isTextblock) {
      let from = pos + 1

      node.forEach((child, childOffset) => {
        const childPos = pos + 1 + childOffset

        if (!child.isText) {
          units.push({ type: 'text', from, to: childPos })
          from = childPos + 1

          return
        }

        // matchAll を使わないのは、1000 ブロックの全選択でメニューを開くと 1 フレームを超えるため
        for (
          let at = child.text!.indexOf('\n');
          at !== -1;
          at = child.text!.indexOf('\n', at + 1)
        ) {
          units.push({ type: 'text', from, to: childPos + at })
          from = childPos + at + 1
        }
      })
      units.push({ type: 'text', from, to: pos + node.nodeSize - 1 })
    } else if (isFixed(node)) {
      units.push({ type: 'node', from: pos, to: pos + node.nodeSize })
    } else {
      readUnits(node.content, pos + 1, units)
    }
  })

  return units
}

// 差分を取らずに順に組にするだけで済むのは、変換が Unit の数・順・長さを変えないため
const correspond = (before: Fragment, after: Fragment, start: number) => {
  const oldUnits = readUnits(before, start)
  const newUnits = readUnits(after, start)
  const ranges: number[] = []
  let oldEnd = start
  let newEnd = start

  const pushGap = (oldTo: number, newTo: number) => {
    if (oldTo > oldEnd || newTo > newEnd) ranges.push(oldEnd, oldTo - oldEnd, newTo - newEnd)
  }

  oldUnits.forEach((unit, i) => {
    pushGap(unit.from, newUnits[i].from)
    oldEnd = unit.to
    newEnd = newUnits[i].to
  })
  pushGap(start + before.size, start + after.size)

  return new StepMap(ranges)
}

export const planConversion = (
  doc: PMNode,
  range: BlockRange,
  shape: ConversionShape,
): ConversionPlan => {
  const content = doc.slice(range.from, range.to).content

  if (!readUnits(content, range.from).some(({ type }) => type === 'text')) {
    return { type: 'unavailable' }
  }

  const nodes = build(content, shape, doc.type.schema)

  if (Fragment.from(nodes).eq(content)) return { type: 'current' }

  // リストだけ範囲の外まで書き換えるのは、隣とつながないと番号付きが 1 から振り直しになり、
  // ツールバーの箇条書き・番号付きとも結果がずれるため
  const replacement =
    shape.type === 'list'
      ? joinAdjacentLists(doc, range, nodes, doc.type.schema.nodes[shape.nodeName])
      : { from: range.from, to: range.to, content: Fragment.from(nodes) }

  return {
    ...replacement,
    type: 'convert',
    positionMap: correspond(
      doc.slice(replacement.from, replacement.to).content,
      replacement.content,
      replacement.from,
    ),
  }
}
