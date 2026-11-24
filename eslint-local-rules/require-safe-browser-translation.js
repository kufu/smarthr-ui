/**
 * @fileoverview ブラウザの自動翻訳機能によるクラッシュ対策として、条件によって出入りする
 * 「要素でラップされていない生のテキスト」がSafeBrowserTranslationで包まれているかを
 * チェックするルール
 * @author SmartHR
 *
 * 背景: ブラウザの自動翻訳機能(Google翻訳等)がテキストノードを別要素に置き換えた後、
 * 条件によって当該テキストがアンマウントされるとReactがクラッシュする既知の問題がある。
 * 詳細は AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」を参照。
 *
 * 「要素でラップされていない生のテキスト」として扱うのは次の2種類:
 * 1. Localizer(および FormattedMessage)要素。smarthr-uiには「文言は多言語化する」規約
 *    (smarthr/require-i18n-text)があり、JSX上で表示されるテキストはほぼ必ずこれらを
 *    経由するため、コンポーネント名のみで機械的に判定できる
 * 2. 文字列リテラル・テンプレートリテラル。型レベルで明らかに文字列であることが確定している
 *
 * 検知するパターン(いずれも JSX の子要素(children)位置にある場合のみ):
 * 1. `{cond && <Localizer .../>}` / `{cond && 'text'}` -
 *    論理AND式の右辺が上記のいずれか
 * 2. `{cond ? <Localizer .../> : X}` / `{cond ? 'text' : X}` (逆の並びも含む) -
 *    三項演算子のどちらか一方のみが上記のいずれか
 *    (両方の分岐が同じ種類の場合、Reactは要素を再利用しマウント/アンマウントが
 *    発生しないため対象外。ただし文字列リテラルとテンプレートリテラルの組み合わせは
 *    どちらも最終的に文字列としてレンダーされるため同じ種類とみなす。Localizerと
 *    FormattedMessageのようにコンポーネント自体が異なる場合は、要素の型が変わるため
 *    対象のまま。同じコンポーネントでもJSXの`key`属性が異なる場合、Reactは要素を
 *    再利用せずアンマウント/マウントするため対象のまま。`key`が動的な式で静的に
 *    比較できない場合も、安全側に倒して対象のまま扱う)
 *
 * 検知しないパターン(対象外。既知の限界):
 * - JSX属性値(`aria-current={current ? 'page' : undefined}` 等)。HTML属性はテキスト
 *   ノードを生成せずブラウザ翻訳の影響を受けないため、JSXの子要素位置にある式のみを対象にする
 * - 既に SafeBrowserTranslation 等の要素でラップされている場合
 *   (LogicalExpression/ConditionalExpression の直下が対象でなくなるため、
 *   このルールの仕組み上自然に対象外になる)
 * - useState 等の変数に一度代入してから条件付きでレンダーするパターン
 *   (例: `setLiveRegionText(<Localizer ... />)` と `setLiveRegionText('')` の組み合わせ)。
 *   構文解析だけでは変数の値の出入りを追跡できないため検知できない。該当しそうな箇所は
 *   AGENTS.md の判断基準に沿ってレビューで見つける必要がある
 * - 変数・関数呼び出し等、型が静的に確定しない式(文字列である保証がないため対象外とする)
 * - 三項演算子で、文字列リテラル/テンプレートリテラルが型の確定しない変数(number等も含む)と
 *   組み合わさっている場合(例: `count > max ? \`${max}+\` : count`)。Reactの内部的には
 *   文字列・数値はどちらも同じ「テキストノード」として扱われ、実際には要素の出入りが
 *   発生せず安全なケースが多いため報告しない(実機検証で確認済み)。ただしLocalizer等の
 *   コンポーネントが絡む場合は要素の型が明確に異なるため、この除外は適用せず報告する
 */

const TARGET_COMPONENT_NAMES = new Set(['Localizer', 'FormattedMessage'])

const getJSXElementName = (node) => {
  if (!node || node.type !== 'JSXElement') {
    return undefined
  }

  const { name } = node.openingElement

  return name.type === 'JSXIdentifier' ? name.name : undefined
}

// JSXの`key`属性を調べる。Reactはkeyが異なると「型が同じでも別のアイデンティティの要素」と
// みなし、旧要素をアンマウントしてから新要素をマウントする(propsの更新による再利用をしない)。
// そのため、両分岐が同じコンポーネントでもkeyが違えば安全とみなせない。
// 値が静的に比較できない(変数等の動的な式)場合は、安全側に倒して「毎回異なる」ものとして扱う
let dynamicKeySeq = 0
const getJSXKeyInfo = (node) => {
  const attr = node.openingElement.attributes.find(
    (a) => a.type === 'JSXAttribute' && a.name.name === 'key',
  )

  if (!attr) {
    return { present: false, value: undefined }
  }

  const { value } = attr
  const literalValue =
    value && value.type === 'Literal'
      ? value.value
      : value && value.type === 'JSXExpressionContainer' && value.expression.type === 'Literal'
        ? value.expression.value
        : undefined

  if (literalValue !== undefined) {
    return { present: true, value: literalValue }
  }

  // 動的な式は静的に比較できないため、安全側に倒して一意な値を割り当て、
  // 他のどのkeyとも一致しない(=安全と判断しない)ようにする
  dynamicKeySeq += 1

  return { present: true, value: `__dynamic_key_${dynamicKeySeq}__` }
}

// 「要素でラップされていない生のテキストを生成する式」を分類する。
// kindが同じであれば、Reactはその式に対応するノードを再利用しマウント/アンマウントが
// 発生しないとみなせる(文字列リテラルとテンプレートリテラルはどちらもkind: 'string'として
// 同一視する。コンポーネントの場合はタグ名が異なると別の型になるため、keyまで一致している
// 必要がある。さらにJSXのkey属性が異なる場合もReactは要素を再利用しないため、keyInfoも
// 一致している必要がある)
const classifyBareTextExpression = (node) => {
  if (!node) {
    return undefined
  }

  const componentName = getJSXElementName(node)

  if (componentName && TARGET_COMPONENT_NAMES.has(componentName)) {
    const keyInfo = getJSXKeyInfo(node)

    return {
      kind: 'component',
      key: `${componentName}:${keyInfo.present ? keyInfo.value : ''}`,
      label: `${componentName}要素`,
    }
  }

  if (node.type === 'Literal' && typeof node.value === 'string') {
    return { kind: 'string', key: 'string', label: '文字列リテラル' }
  }

  if (node.type === 'TemplateLiteral') {
    return { kind: 'string', key: 'string', label: 'テンプレートリテラル' }
  }

  return undefined
}

const isSameSafeKind = (a, b) => a.kind === b.kind && a.key === b.key

// `null`/`undefined`/`false` は「何もレンダーされない」ことが静的に確定しているリテラル。
// 型が不明な変数(number等も含みうる)とは異なり、文字列リテラルとの組み合わせでも
// 「要素の有無そのものが切り替わる」ため依然として危険。型不明な変数との混在時の
// 緩和対象から除外するために判定する
const isDefinitelyEmptyExpression = (node) => {
  if (!node) {
    return false
  }

  if (node.type === 'Literal' && (node.value === null || node.value === false)) {
    return true
  }

  return node.type === 'Identifier' && node.name === 'undefined'
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

// このルールが対象とするのは、ブラウザ翻訳によって書き換えられうる「画面に表示されるテキスト」。
// JSX属性値(`aria-current={current ? 'page' : undefined}` 等)はHTML属性でありテキストノードを
// 生成しないため、翻訳機能の影響を受けず対象外。JSXの子要素(children)位置にある式のみを対象にする
const isJSXChildPosition = (node) => {
  const container = node.parent

  if (!container || container.type !== 'JSXExpressionContainer') {
    return false
  }

  const containerParent = container.parent

  return (
    containerParent !== undefined &&
    (containerParent.type === 'JSXElement' || containerParent.type === 'JSXFragment') &&
    containerParent.children.includes(container)
  )
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'ブラウザの自動翻訳機能によるクラッシュを防ぐため、条件によって出入りする生のテキストはSafeBrowserTranslationで包む',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      requireSafeBrowserTranslation:
        '{{ label }}が条件によって出入りしています。ブラウザの自動翻訳機能によるクラッシュを防ぐため、SafeBrowserTranslationで包んでください。' +
        '\n詳細: AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」',
    },
  },

  create(context) {
    const report = (node, label) => {
      context.report({
        node,
        messageId: 'requireSafeBrowserTranslation',
        data: { label },
      })
    }

    return {
      LogicalExpression(node) {
        if (node.operator !== '&&' || !isJSXChildPosition(node)) {
          return
        }

        const info = classifyBareTextExpression(node.right)

        if (info) {
          report(node.right, info.label)
        }
      },

      ConditionalExpression(node) {
        // ネストしたConditionalExpressionの分岐自体は、根本のConditionalExpressionで
        // まとめて処理するためスキップする
        if (isConditionalBranch(node)) {
          return
        }

        if (!isJSXChildPosition(node)) {
          return
        }

        const leaves = []

        collectConditionalLeaves(node, leaves)

        const classified = leaves.map((leaf) => ({ leaf, info: classifyBareTextExpression(leaf) }))
        const targetEntries = classified.filter((entry) => entry.info !== undefined)

        if (targetEntries.length === 0) {
          return
        }

        // すべての分岐が同じ種類(同じコンポーネント、または文字列同士)の場合、
        // Reactはノードを再利用しマウント/アンマウントが発生しないため安全
        const referenceInfo = targetEntries[0].info
        const allSameKind = classified.every(
          (entry) => entry.info !== undefined && isSameSafeKind(entry.info, referenceInfo),
        )

        if (allSameKind) {
          return
        }

        // 文字列リテラル/テンプレートリテラルが、型の確定しない変数(number等も含む)と
        // 組み合わさっている場合は報告しない。Reactの内部的には文字列・数値はどちらも
        // 同じ「テキストノード」として扱われ、実際にはマウント/アンマウントが発生せず
        // 安全なケースが多いため(実例: `count > max ? \`${max}+\` : count` のような
        // テンプレートリテラルとnumber変数の組み合わせはクラッシュしないことを実機確認済み)。
        // ただし `null`/`undefined`/`false` との組み合わせは「何もレンダーされない」ことが
        // 確定しており、要素の有無そのものが切り替わるため緩和しない。
        // 一方Localizer等のコンポーネントは要素の型が明確に異なり安全と判断できないため、
        // 変数との混在でも報告する
        const hasUnclassifiedBranch = classified.some(
          (entry) => entry.info === undefined && !isDefinitelyEmptyExpression(entry.leaf),
        )

        for (const { leaf, info } of targetEntries) {
          if (info.kind === 'string' && hasUnclassifiedBranch) {
            continue
          }

          report(leaf, info.label)
        }
      },
    }
  },
}
