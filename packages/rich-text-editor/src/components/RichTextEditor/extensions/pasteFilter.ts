import { Fragment, Slice } from '@tiptap/pm/model'

import { createTypeAllowChecker } from './restrictOperations'

import type { RichTextFeature } from '../types'
import type { Mark, Node as ProseMirrorNode } from '@tiptap/pm/model'

/**
 * textStyle markの属性はfeatureごとに分かれているので、mark単位ではなく属性単位で絞る。
 */
const FEATURE_BY_TEXT_STYLE_ATTRIBUTE: Readonly<Record<string, RichTextFeature>> = {
  color: 'color',
  backgroundColor: 'backgroundColor',
  fontSize: 'fontSize',
}

/** paragraph / heading に付く属性 */
const FEATURE_BY_NODE_ATTRIBUTE: Readonly<Record<string, RichTextFeature>> = {
  textAlign: 'textAlign',
  lineHeight: 'lineHeight',
}

/** featureが許可されていない属性をnullに落とす。深さは変わらないのでslice構造には影響しない */
const clampAttributes = (
  attributes: Record<string, unknown>,
  featureByAttribute: Readonly<Record<string, RichTextFeature>>,
  isAllowed: (name: string) => boolean,
) =>
  Object.entries(attributes).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const feature = featureByAttribute[key]

    acc[key] = feature !== undefined && !isAllowed(feature) ? null : value

    return acc
  }, {})

/**
 * ペースト内容からfeaturesに含まれない書式を取り除く。
 *
 * schemaは常に全書式を載せている（既存データを失わないため）ので、schemaだけでは
 * ペーストを止められない。featuresの許可リストで絞るのはこの層の責務。
 *
 * - mark: 除去（テキストは残す）
 * - textStyle / paragraph の属性: 該当featureが無いものをnullにする
 * - inline contentを持つnode（heading等）: paragraphへ降格
 * - blockを持つnode（table / list / blockquote等）: 子を親へ引き上げて平坦化
 * - atom / leaf node（image / youtube / horizontalRule）: 削除
 */
export const createPasteFilter = (features: readonly RichTextFeature[]) => {
  const isAllowedType = createTypeAllowChecker(features)
  const isAllowedFeature = (feature: string) => features.includes(feature as RichTextFeature)

  return (slice: Slice): Slice => {
    // node構造を変えた場合はopenStart/openEndが元の深さと合わなくなるため、
    // 変更したかどうかを覚えておいてブロック貼り付けへ倒す
    let structureChanged = false

    const filterMarks = (marks: readonly Mark[]) =>
      marks.reduce<Mark[]>((acc, mark) => {
        if (!isAllowedType(mark.type.name)) return acc

        if (mark.type.name !== 'textStyle') {
          acc.push(mark)

          return acc
        }

        const attributes = clampAttributes(
          mark.attrs,
          FEATURE_BY_TEXT_STYLE_ATTRIBUTE,
          isAllowedFeature,
        )

        // 属性が全て空になったtextStyleは残す意味がない
        if (Object.values(attributes).every((value) => value === null)) return acc

        acc.push(mark.type.create(attributes))

        return acc
      }, [])

    const filterFragment = (fragment: Fragment): ProseMirrorNode[] => {
      const nodes: ProseMirrorNode[] = []

      fragment.forEach((child) => {
        nodes.push(...filterNode(child))
      })

      return nodes
    }

    const toParagraph = (node: ProseMirrorNode) => {
      const paragraphType = node.type.schema.nodes.paragraph

      return paragraphType.create(null, Fragment.fromArray(filterFragment(node.content)))
    }

    const filterNode = (node: ProseMirrorNode): ProseMirrorNode[] => {
      const marks = filterMarks(node.marks)

      if (node.isText) return [node.mark(marks)]

      if (!isAllowedType(node.type.name)) {
        structureChanged = true

        if (node.isAtom || node.isLeaf) return []
        if (node.inlineContent) return [toParagraph(node)]

        // blockを持つnodeは子を引き上げる。子が制限対象ならそこでも同じ判定が走る
        return filterFragment(node.content)
      }

      const attributes = clampAttributes(node.attrs, FEATURE_BY_NODE_ATTRIBUTE, isAllowedFeature)

      return [node.type.create(attributes, Fragment.fromArray(filterFragment(node.content)), marks)]
    }

    const content = Fragment.fromArray(filterFragment(slice.content))

    return structureChanged
      ? new Slice(content, 0, 0)
      : new Slice(content, slice.openStart, slice.openEnd)
  }
}
