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
 * 「要素でラップされていない生のテキスト」として扱うのは次の3種類:
 * 1. Localizer(および FormattedMessage)要素。smarthr-uiには「文言は多言語化する」規約
 *    (smarthr/require-i18n-text)があり、JSX上で表示されるテキストはほぼ必ずこれらを
 *    経由するため、コンポーネント名のみで機械的に判定できる
 * 2. 文字列リテラル・テンプレートリテラル。型レベルで明らかに文字列であることが確定している
 *    (ただし空文字列`''`は`null`/`undefined`/`false`と同じく「何もレンダーされない」値のため
 *    「生のテキスト」としては扱わない)
 * 3. `localize(...)`/`formatMessage(...)`の呼び出し結果。useIntlの`localize`(および
 *    react-intlの`formatMessage`)は戻り値が常にstring型のLocalizerの関数版で、
 *    呼び出し式のメソッド名のみで機械的に判定できる。文字列リテラルと同じ`kind: 'string'`
 *    として扱う(ただし戻り値が実行時に空文字列になりうるかは判定できないため、
 *    文字列リテラルの空文字列判定のような緩和は適用しない)
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
 *    対象のまま。同じコンポーネントでもJSXの`key`属性が異なる場合(`key`の省略と
 *    `key=""`のような明示的な空文字列指定も区別する。Reactでは前者がnull、後者が
 *    ''であり異なる値のため)、Reactは要素を再利用せずアンマウント/マウントするため
 *    対象のまま。`key`が動的な式、またはJSXSpreadAttribute(`{...props}`)経由で
 *    静的に存在を判定できない場合も、安全側に倒して対象のまま扱う)
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
 * - 変数・関数呼び出し等、型が静的に確定しない式(文字列である保証がないため対象外とする。
 *   ただし`localize`/`formatMessage`の呼び出しは前述の通り対象)
 * - 三項演算子で、文字列リテラル/テンプレートリテラルが型の確定しない変数(number等も含む)と
 *   組み合わさっている場合(例: `count > max ? \`${max}+\` : count`)。Reactの内部的には
 *   文字列・数値はどちらも同じ「テキストノード」として扱われ、実際には要素の出入りが
 *   発生せず安全なケースが多いため報告しない(実機検証で確認済み)。ただしLocalizer等の
 *   コンポーネントが絡む場合や、対象外のJSX要素(`<Icon />`等)・Fragmentと組み合わさっている
 *   場合は要素の型が明確に異なるため、この除外は適用せず報告する。ネストした三項演算子で
 *   `null`/`undefined`/`false`/`''`が確定した分岐として混在する場合も、他の分岐が型不明の
 *   変数であっても「要素の有無」自体が切り替わることが確定しているため、この除外は適用せず
 *   報告する(例: `a ? 'text' : b ? null : value` は `value` が型不明でも報告する)
 * - 型不明の変数(number等)が実行時に`null`/`undefined`/`false`になりうる場合(例:
 *   `{cond ? 'text' : value}` で `value` が`null`を返しうる場合)。型情報のない構文解析では
 *   変数が実行時にどんな値になりうるか判定できないため検知できない。該当しそうな箇所は
 *   AGENTS.md の判断基準に沿ってレビューで見つける必要がある
 */

const TARGET_COMPONENT_NAMES = new Set(['Localizer', 'FormattedMessage'])

// useIntlの`localize`(およびreact-intlの`formatMessage`)はLocalizerの関数版で、
// 戻り値は常にstring型。`intl.formatMessage(...)`のようなメンバー式経由の呼び出しも
// 対象にするため、メソッド名(プロパティ名)のみで判定する
const TARGET_CALL_NAMES = new Set(['localize', 'formatMessage'])

const getJSXElementName = (node) => {
  if (!node || node.type !== 'JSXElement') {
    return undefined
  }

  const { name } = node.openingElement

  return name.type === 'JSXIdentifier' ? name.name : undefined
}

const getCallExpressionName = (node) => {
  if (!node || node.type !== 'CallExpression') {
    return undefined
  }

  const { callee } = node

  if (callee.type === 'Identifier') {
    return callee.name
  }

  if (callee.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier') {
    return callee.property.name
  }

  return undefined
}

// JSXの`key`属性を調べる。Reactはkeyが異なると「型が同じでも別のアイデンティティの要素」と
// みなし、旧要素をアンマウントしてから新要素をマウントする(propsの更新による再利用をしない)。
// そのため、両分岐が同じコンポーネントでもkeyが違えば安全とみなせない。
// 値が静的に比較できない(変数等の動的な式)場合は、安全側に倒して「毎回異なる」ものとして扱う
let dynamicKeySeq = 0
const getJSXKeyInfo = (node) => {
  const { attributes } = node.openingElement
  const attr = attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === 'key')

  if (!attr) {
    // JSXSpreadAttribute(`{...props}`)経由でkeyが渡されている可能性があり、
    // 静的には存在を判定できないため、安全側に倒して動的なkeyと同様に扱う
    if (attributes.some((a) => a.type === 'JSXSpreadAttribute')) {
      dynamicKeySeq += 1

      return { present: true, value: `__dynamic_key_${dynamicKeySeq}__` }
    }

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

    // keyの省略(present: false)と`key=""`のような明示的な空文字列指定は、
    // Reactでは前者がnull・後者が''で異なる値になるため、presentも比較対象に含める
    return {
      kind: 'component',
      key: `${componentName}:${keyInfo.present}:${keyInfo.present ? keyInfo.value : ''}`,
      label: `${componentName}要素`,
    }
  }

  // 空文字列はReactが子要素として受け取ってもテキストノードを生成しない
  // (`null`/`undefined`/`false`と同じく「何もレンダーされない」値のため)
  if (node.type === 'Literal' && typeof node.value === 'string' && node.value !== '') {
    return { kind: 'string', key: 'string', label: '文字列リテラル' }
  }

  if (node.type === 'TemplateLiteral') {
    return { kind: 'string', key: 'string', label: 'テンプレートリテラル' }
  }

  const callName = getCallExpressionName(node)

  if (callName && TARGET_CALL_NAMES.has(callName)) {
    return { kind: 'string', key: 'string', label: `${callName}()の呼び出し結果` }
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

  // JSX要素・Fragmentはnumber等と異なり確実に要素であり、文字列との切り替えで
  // 要素の出入りが発生する(緩和対象の「型が不明な変数」には該当しない)
  if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
    return true
  }

  // 空文字列もnull/false同様「何もレンダーされない」ことが確定している
  if (node.type === 'Literal' && (node.value === null || node.value === false || node.value === '')) {
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
        if (isConditionalBranch(node) || !isJSXChildPosition(node)) {
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

        // ただし確定した空の分岐(`null`/`undefined`/`false`/`''`)が含まれる場合、
        // 型不明の分岐の実際の値に関わらず「要素の有無」自体が切り替わることが
        // 確定しているため、上記の緩和を適用せず報告する
        const hasDefinitelyEmptyBranch = classified.some((entry) =>
          isDefinitelyEmptyExpression(entry.leaf),
        )

        for (const { leaf, info } of targetEntries) {
          if (info.kind === 'string' && hasUnclassifiedBranch && !hasDefinitelyEmptyBranch) {
            continue
          }

          report(leaf, info.label)
        }
      },
    }
  },
}
