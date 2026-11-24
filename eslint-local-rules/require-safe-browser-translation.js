/**
 * @fileoverview ブラウザの自動翻訳機能によるクラッシュ対策として、条件によって出入りする
 * Localizer要素がSafeBrowserTranslationで包まれているかをチェックするルール
 * @author SmartHR
 *
 * 背景: ブラウザの自動翻訳機能(Google翻訳等)がテキストノードを別要素に置き換えた後、
 * 条件によって当該テキストがアンマウントされるとReactがクラッシュする既知の問題がある。
 * 詳細は AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」を参照。
 *
 * smarthr-uiでは「文言は多言語化する」規約(smarthr/require-i18n-text)により、
 * JSX上で表示されるテキストはほぼ必ず Localizer を経由する。そのため、要素でラップされて
 * いない生のテキストかどうかの判定は、Localizer(および FormattedMessage)という
 * コンポーネント名のみで機械的に行える。
 *
 * 検知するパターン:
 * 1. `{cond && <Localizer .../>}` - 論理AND式の右辺が対象コンポーネントの要素
 * 2. `{cond ? <Localizer .../> : X}` / `{cond ? X : <Localizer .../>}` -
 *    三項演算子のどちらか一方のみが対象コンポーネントの要素
 *    (両方の分岐が対象コンポーネントの要素の場合、Reactは要素を再利用し
 *    マウント/アンマウントが発生しないため対象外)
 *
 * 検知しないパターン(対象外。既知の限界):
 * - 既に SafeBrowserTranslation 等の要素でラップされている場合
 *   (LogicalExpression/ConditionalExpression の直下が対象コンポーネントでなくなるため、
 *   このルールの仕組み上自然に対象外になる)
 * - useState 等の変数に一度代入してから条件付きでレンダーするパターン
 *   (例: `setLiveRegionText(<Localizer ... />)` と `setLiveRegionText('')` の組み合わせ)。
 *   構文解析だけでは変数の値の出入りを追跡できないため検知できない。該当しそうな箇所は
 *   AGENTS.md の判断基準に沿ってレビューで見つける必要がある
 */

const TARGET_COMPONENT_NAMES = new Set(['Localizer', 'FormattedMessage'])

const getJSXElementName = (node) => {
  if (!node || node.type !== 'JSXElement') {
    return undefined
  }

  const { name } = node.openingElement

  return name.type === 'JSXIdentifier' ? name.name : undefined
}

const getTargetComponentName = (node) => {
  const name = getJSXElementName(node)

  return name && TARGET_COMPONENT_NAMES.has(name) ? name : undefined
}

// `a ? x : b ? y : z` のようなネストしたConditionalExpressionは、他のConditionalExpressionの
// consequent/alternateそのもの。これ単体ではなく、根本のConditionalExpressionでまとめて
// 全分岐を判定する必要があるため、分岐自身であるノードはスキップする
const isConditionalBranch = (node) => {
  const { parent } = node

  return (
    parent !== undefined &&
    parent.type === 'ConditionalExpression' &&
    (parent.consequent === node || parent.alternate === node)
  )
}

// ネストしたConditionalExpressionを再帰的に辿り、最終的な分岐(JSXElement等)をすべて集める
const collectConditionalLeaves = (node, leaves) => {
  if (node.type === 'ConditionalExpression') {
    collectConditionalLeaves(node.consequent, leaves)
    collectConditionalLeaves(node.alternate, leaves)
  } else {
    leaves.push(node)
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'ブラウザの自動翻訳機能によるクラッシュを防ぐため、条件によって出入りするLocalizer要素はSafeBrowserTranslationで包む',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      requireSafeBrowserTranslation:
        '{{ name }}要素が条件によって出入りしています。ブラウザの自動翻訳機能によるクラッシュを防ぐため、SafeBrowserTranslationで包んでください。' +
        '\n詳細: AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」',
    },
  },

  create(context) {
    const report = (node, name) => {
      context.report({
        node,
        messageId: 'requireSafeBrowserTranslation',
        data: { name },
      })
    }

    return {
      LogicalExpression(node) {
        if (node.operator !== '&&') {
          return
        }

        const name = getTargetComponentName(node.right)

        if (name) {
          report(node.right, name)
        }
      },

      ConditionalExpression(node) {
        // ネストしたConditionalExpressionの分岐自体は、根本のConditionalExpressionで
        // まとめて処理するためスキップする
        if (isConditionalBranch(node)) {
          return
        }

        const leaves = []

        collectConditionalLeaves(node, leaves)

        const targetLeaves = leaves
          .map((leaf) => ({ leaf, name: getTargetComponentName(leaf) }))
          .filter((entry) => entry.name !== undefined)

        if (targetLeaves.length === 0) {
          return
        }

        // すべての分岐が対象コンポーネントの場合、Reactは要素を再利用し
        // マウント/アンマウントが発生しないため安全
        if (targetLeaves.length === leaves.length) {
          return
        }

        for (const { leaf, name } of targetLeaves) {
          report(leaf, name)
        }
      },
    }
  },
}
