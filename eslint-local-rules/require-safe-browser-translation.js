/**
 * @fileoverview ブラウザの自動翻訳機能によるクラッシュ対策として、条件によって出入りする
 * 「要素でラップされていない生のテキスト」が要素(SafeBrowserTranslation等)で囲まれているかを
 * チェックするルール。あわせて、SafeBrowserTranslationが適切な位置・方法で使われているかもチェックする
 * @author SmartHR
 *
 * 背景: ブラウザの自動翻訳機能(Google翻訳等)がテキストノードを別要素に置き換えた後、
 * 条件によって当該テキストがアンマウントされるとReactがクラッシュする既知の問題がある。
 * 詳細は AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」を参照。
 *
 * 検知パターン・対象外になるケース・既知の限界・オプションの詳細は
 * eslint-local-rules/README.md を参照。
 *
 * HINT: このルールは eslint-plugin-smarthr の smarthr/require-safe-browser-translation と
 * 判定ロジックを揃えている。変更する場合は両方に反映すること
 */

const SCHEMA = [
  {
    type: 'object',
    properties: {
      additionalTextComponentRegex: { type: 'array', items: { type: 'string' } },
      additionalTextFunctionRegex: { type: 'array', items: { type: 'string' } },
      additionalTextVariableRegex: { type: 'array', items: { type: 'string' } },
    },
    additionalProperties: false,
  },
]

// 実体としてテキストノードしか生成しないコンポーネント
const TEXT_COMPONENT_NAMES = '^(Localizer|FormattedMessage)$'
// 戻り値が常に文字列になる関数(上記コンポーネントの関数版)
const TEXT_FUNCTION_NAMES = '^(localize|formatMessage)$'
// 値が文字列であると推測できる変数・プロパティアクセス
// - translated.xxx / localized.xxx: 翻訳済みの文言をまとめたオブジェクトの属性
// - name / label / text / title / message / description、およびそれらで終わる名称(xxxName、xxx.name 等)
const TEXT_VARIABLE_NAMES =
  '^(translated|localized)\\.|(^|\\.)(name|label|text|title|message|description)$|(Name|Label|Text|Title|Message|Description)$'

const SAFE_BROWSER_TRANSLATION_NAME = 'SafeBrowserTranslation'
const MAP_METHOD_NAMES = /^(map|flatMap)$/
const FUNCTION_TYPES = /^(ArrowFunctionExpression|FunctionExpression|FunctionDeclaration)$/
const TS_WRAPPER_TYPES = /^TS(AsExpression|SatisfiesExpression|NonNullExpression|TypeAssertion)$/

// HINT: 空配列の場合に末尾が`|`の正規表現(すべての名称にマッチする)を生成しないよう、要素数で判定する
const generateRegex = (base, additional) =>
  new RegExp(additional?.length ? `${base}|${additional.join('|')}` : base)

const getJSXElementName = (node) => {
  if (node.type !== 'JSXElement') return undefined

  const { name } = node.openingElement

  return name.type === 'JSXIdentifier' ? name.name : undefined
}

// HINT: `intl.formatMessage(...)` のようなメンバー式経由の呼び出しも対象にするため、プロパティ名でも判定する
const getCallExpressionName = (node) => {
  if (node.type !== 'CallExpression') return undefined

  const { callee } = node

  if (callee.type === 'Identifier') return callee.name
  if (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.property.type === 'Identifier'
  )
    return callee.property.name

  return undefined
}

// 変数・プロパティアクセスを`.`つなぎの文字列に変換する(例: `user?.name` → `user.name`)
// HINT: `items[0].name` や `getUser().name` のように`.`つなぎで表せない式は対象外
const getVariablePath = (node) => {
  switch (node.type) {
    case 'Identifier':
      return node.name
    case 'ThisExpression':
      return 'this'
    case 'ChainExpression':
    case 'TSNonNullExpression':
      return getVariablePath(node.expression)
    case 'MemberExpression': {
      if (node.computed || node.property.type !== 'Identifier') return undefined

      const objectPath = getVariablePath(node.object)

      return objectPath ? `${objectPath}.${node.property.name}` : undefined
    }
  }

  return undefined
}

// 補間を持たず、静的に空文字列であることが確定しているテンプレートリテラル(``)かどうか
const isStaticallyEmptyTemplateLiteral = (node) =>
  node.type === 'TemplateLiteral' &&
  node.expressions.length === 0 &&
  node.quasis.length === 1 &&
  node.quasis[0].value.cooked === ''

// 「何もレンダーされない」、もしくは「確実に要素である」ことが静的に確定している式かどうか
// HINT: 型が不明な変数(number等も含みうる)とは異なり、文字列との組み合わせで要素の有無そのものが切り替わることが確定する
const isDefinitelyNotTextExpression = (node) => {
  switch (node.type) {
    case 'JSXElement':
    case 'JSXFragment':
      return true
    case 'Literal':
      // Reactはbooleanのtrue/false、null、空文字列を子要素としてレンダーしない
      return node.value === null || node.value === false || node.value === true || node.value === ''
    case 'TemplateLiteral':
      return isStaticallyEmptyTemplateLiteral(node)
    case 'Identifier':
      return node.name === 'undefined'
  }

  return false
}

// `a ? x : b ? y : z` のようなネストした三項演算子は、根本の三項演算子でまとめて全分岐を判定する
const isConditionalBranch = (node) => {
  const { parent } = node

  return (
    parent.type === 'ConditionalExpression' &&
    (parent.consequent === node || parent.alternate === node)
  )
}

const collectConditionalLeaves = (node, leaves = []) => {
  if (node.type === 'ConditionalExpression') {
    collectConditionalLeaves(node.consequent, leaves)
    collectConditionalLeaves(node.alternate, leaves)
  } else {
    leaves.push(node)
  }

  return leaves
}

// JSXの子要素(children)の位置にある式かどうか
// HINT: JSX属性値(`aria-current={current ? 'page' : undefined}` 等)はテキストノードを生成せず、ブラウザ翻訳の影響を受けないため対象外
// `{visible && (loading ? <Localizer /> : null)}` のように&&の右辺にある場合は、&&を根まで遡って判定する
const isJSXChildExpressionPosition = (node) => {
  let current = node

  while (
    current.parent.type === 'LogicalExpression' &&
    current.parent.operator === '&&' &&
    current.parent.right === current
  ) {
    current = current.parent
  }

  const container = current.parent

  return (
    container.type === 'JSXExpressionContainer' &&
    (container.parent.type === 'JSXElement' || container.parent.type === 'JSXFragment')
  )
}

// `items.map(...)` / `items.flatMap(...)` の呼び出しかどうか
const isMapCallExpression = (node) => {
  if (node.type !== 'CallExpression') return false

  const { callee } = node

  return (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    MAP_METHOD_NAMES.test(callee.property.name)
  )
}

// mapメソッドのコールバック関数かどうか
const isMapCallback = (node) =>
  isMapCallExpression(node.parent) && node.parent.arguments.includes(node)

// return文が「mapメソッドのコールバック関数の戻り値」もしくは「if・switchによる条件付きのreturn」かどうか
const isConditionalOrMapReturn = (node) => {
  let conditional = false
  let current = node.parent

  while (current && !FUNCTION_TYPES.test(current.type)) {
    if (current.type === 'IfStatement' || current.type === 'SwitchStatement') {
      conditional = true
    }

    current = current.parent
  }

  return !!current && (conditional || isMapCallback(current))
}

// 条件分岐・mapメソッドによって出入りする子要素を持つかどうか
// HINT: 出入りする要素の直後にテキストノードがある場合、要素の挿入位置の基準となるテキストノードが
// ブラウザ翻訳によって置き換えられているとinsertBeforeでクラッシュする。
// そのため出入りする兄弟を持つテキストをSafeBrowserTranslationで囲むことは正当な利用として扱う
const hasConditionalSibling = (parent, node) =>
  parent.children.some((child) => {
    if (child === node || child.type !== 'JSXExpressionContainer') return false

    let { expression } = child

    while (TS_WRAPPER_TYPES.test(expression.type)) {
      expression = expression.expression
    }

    return (
      expression.type === 'LogicalExpression' ||
      expression.type === 'ConditionalExpression' ||
      isMapCallExpression(expression)
    )
  })

// SafeBrowserTranslationが「条件分岐・mapメソッドによって出入りするテキストを直接囲む位置」にあるかどうか
const isSafeBrowserTranslationPosition = (node) => {
  let current = node

  while (current.parent) {
    const { parent } = current

    switch (parent.type) {
      case 'LogicalExpression':
        return parent.right === current
      case 'ConditionalExpression':
        return parent.consequent === current || parent.alternate === current
      case 'ArrowFunctionExpression':
        return parent.body === current && isMapCallback(parent)
      case 'ReturnStatement':
        return isConditionalOrMapReturn(parent)
      case 'JSXElement':
        return hasConditionalSibling(parent, current)
      case 'JSXFragment':
        // HINT: Fragmentは要素を生成しないため、Fragment自体の位置で判定する
        if (hasConditionalSibling(parent, current)) return true
        break
      default:
        if (!TS_WRAPPER_TYPES.test(parent.type)) return false
    }

    current = parent
  }

  return false
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'ブラウザの自動翻訳機能によるクラッシュを防ぐため、条件によって出入りする生のテキストは要素(SafeBrowserTranslation等)で囲む',
      category: 'Best Practices',
      recommended: true,
    },
    schema: SCHEMA,
    messages: {
      requireSafeBrowserTranslation:
        '{{ label }}が条件によって出入りしています。ブラウザの自動翻訳機能を利用している場合、Reactがクラッシュする可能性があります。' +
        '\n - 意味づけ・スタイルのために要素で囲むべきテキストの場合、適切な要素で囲んでください(spanに限らず、テキストと一緒に出入りする要素であれば問題ありません)' +
        '\n - 現状のマークアップが正しい場合、SafeBrowserTranslationで囲み、意味づけ・スタイルのための要素ではないことを明確にしてください' +
        '\n - いずれの場合も、条件分岐の内側でテキストを囲んでください。条件分岐の外側を囲んでも解決しません' +
        '\n詳細: AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」',
      invalidSafeBrowserTranslationPosition:
        'SafeBrowserTranslationは、条件分岐もしくはmapメソッドによって出入りするテキストを直接囲む位置で利用してください。' +
        '\n - テキストが出入りしない場合、もしくは親の要素と一緒に出入りする場合、SafeBrowserTranslationは不要なため削除してください' +
        '\n - 別の場所にある条件分岐・mapメソッドによって出入りする場合、その条件分岐・mapメソッドの内側に移動してください' +
        '\n - stateに保持する等、意図的にこの位置で利用している場合は eslint-disable で理由を明記してください' +
        '\n詳細: AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」',
      invalidSafeBrowserTranslationAttribute:
        'SafeBrowserTranslationにkey以外の属性を指定しないでください。' +
        '\n - SafeBrowserTranslationは「意味づけ・スタイルのための要素ではない」ことを明確にするためのコンポーネントです' +
        '\n - 属性が必要な場合、意味づけ・スタイルのための要素のため、spanなどの適切な要素に置き換えてください' +
        '\n詳細: AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」',
      unnecessarySafeBrowserTranslation:
        'SafeBrowserTranslationの中身は、要素でラップされていない生のテキストではないため不要です。' +
        '\n - 対象はLocalizer/FormattedMessage要素、文字列・テンプレートリテラル、localize()等の呼び出し結果、name/label等の変数です' +
        '\n - Icon等、中身が確実に要素であるコンポーネントを包んでいる場合はSafeBrowserTranslationを削除してください' +
        '\n詳細: AGENTS.md「ブラウザの自動翻訳機能によるクラッシュ対策」',
    },
  },
  create(context) {
    const options = context.options[0] || {}
    const textComponentRegex = generateRegex(
      TEXT_COMPONENT_NAMES,
      options.additionalTextComponentRegex,
    )
    const textFunctionRegex = generateRegex(
      TEXT_FUNCTION_NAMES,
      options.additionalTextFunctionRegex,
    )
    const textVariableRegex = generateRegex(
      TEXT_VARIABLE_NAMES,
      options.additionalTextVariableRegex,
    )

    // JSXのkey属性を調べる
    // HINT: Reactはkeyが異なると型が同じでも要素を再利用せず、アンマウントしてからマウントする
    // 値が静的に比較できない場合は、安全側に倒して他のどのkeyとも一致しない値として扱う
    let dynamicKeySeq = 0
    const getJSXKey = (node) => {
      const { attributes } = node.openingElement
      const attr = attributes.find((a) => a.type === 'JSXAttribute' && a.name.name === 'key')

      if (!attr) {
        // スプレッド経由でkeyが渡されている可能性があり、静的には存在を判定できない
        return attributes.some((a) => a.type === 'JSXSpreadAttribute')
          ? `dynamic:${dynamicKeySeq++}`
          : 'none'
      }

      const literal =
        attr.value?.type === 'JSXExpressionContainer' ? attr.value.expression : attr.value

      // HINT: keyの省略と`key=""`はReactでは異なる値(null と '')のため区別する
      return literal?.type === 'Literal' ? `static:${literal.value}` : `dynamic:${dynamicKeySeq++}`
    }

    // 「要素でラップされていない生のテキストを生成する式」を分類する
    // identityが同じであれば、Reactはノードを再利用しマウント/アンマウントが発生しない
    const classifyBareText = (node) => {
      const componentName = getJSXElementName(node)

      if (componentName && textComponentRegex.test(componentName)) {
        return {
          isString: false,
          identity: `${componentName}:${getJSXKey(node)}`,
          label: `${componentName}要素`,
        }
      }

      // 空文字列は「何もレンダーされない」値のため対象外
      if (node.type === 'Literal' && typeof node.value === 'string' && node.value !== '') {
        return { isString: true, identity: 'string', label: '文字列リテラル' }
      }

      // HINT: 補間を持つテンプレートリテラルは実行時に空になるか判定できないため対象とする
      if (node.type === 'TemplateLiteral' && !isStaticallyEmptyTemplateLiteral(node)) {
        return { isString: true, identity: 'string', label: 'テンプレートリテラル' }
      }

      const functionName = getCallExpressionName(node)

      if (functionName && textFunctionRegex.test(functionName)) {
        return { isString: true, identity: 'string', label: `${functionName}()の呼び出し結果` }
      }

      const variablePath = getVariablePath(node)

      // HINT: undefinedは「何もレンダーされない」値のため、正規表現にマッチしても対象外
      if (variablePath && variablePath !== 'undefined' && textVariableRegex.test(variablePath)) {
        return { isString: true, identity: 'string', label: variablePath }
      }

      return undefined
    }

    const report = (node, label) => {
      context.report({
        node,
        messageId: 'requireSafeBrowserTranslation',
        data: { label },
      })
    }

    // HINT: 前後の空白のみのJSXTextは実質的な子要素ではないため除外する
    const getMeaningfulChildren = (node) =>
      node.children.filter((child) => !(child.type === 'JSXText' && child.value.trim() === ''))

    // SafeBrowserTranslationの中身が「要素でラップされていない生のテキスト」かどうか
    // 子要素が1つに定まらない場合は、安全側に倒して「生のテキストである(=必要)」とみなす
    const isSafeBrowserTranslationContentBareText = (node) => {
      const children = getMeaningfulChildren(node)

      if (children.length !== 1) return true

      const [child] = children

      // 直接書かれた文字列(`<SafeBrowserTranslation>保存</SafeBrowserTranslation>`)は常に生のテキスト
      if (child.type === 'JSXText') return true

      const expression = child.type === 'JSXExpressionContainer' ? child.expression : child

      return !!classifyBareText(expression)
    }

    return {
      [`JSXElement[openingElement.name.name="${SAFE_BROWSER_TRANSLATION_NAME}"]`]: (node) => {
        const { openingElement } = node

        // HINT: keyは要素を再生成させる目的で指定する場合があるため対象外
        if (
          openingElement.attributes.some((a) => a.type !== 'JSXAttribute' || a.name.name !== 'key')
        ) {
          context.report({
            node: openingElement,
            messageId: 'invalidSafeBrowserTranslationAttribute',
          })
        }

        if (!isSafeBrowserTranslationPosition(node)) {
          context.report({
            node: openingElement,
            messageId: 'invalidSafeBrowserTranslationPosition',
          })
        } else if (!isSafeBrowserTranslationContentBareText(node)) {
          context.report({
            node: openingElement,
            messageId: 'unnecessarySafeBrowserTranslation',
          })
        }
      },
      'LogicalExpression[operator="&&"]': (node) => {
        if (!isJSXChildExpressionPosition(node)) return

        const info = classifyBareText(node.right)

        if (info) {
          report(node.right, info.label)
        }
      },
      ConditionalExpression: (node) => {
        if (isConditionalBranch(node) || !isJSXChildExpressionPosition(node)) return

        const classified = collectConditionalLeaves(node).map((leaf) => ({
          leaf,
          info: classifyBareText(leaf),
        }))
        const targets = classified.filter((entry) => entry.info)

        if (targets.length === 0) return

        // すべての分岐が同じ種類(同じコンポーネントかつ同じkey、または文字列同士)の場合、
        // Reactはノードを再利用しマウント/アンマウントが発生しないため安全
        const { identity } = targets[0].info

        if (classified.every((entry) => entry.info?.identity === identity)) return

        // 文字列が型の確定しない式(number等も含みうる変数等)とのみ組み合わさっている場合は報告しない
        // HINT: Reactは文字列・数値をどちらも同じテキストノードとして扱うため、要素の出入りが発生せず安全なケースが多い
        // (例: `count > max ? \`\${max}+\` : count`)
        // ただし、何もレンダーされない値・要素が分岐に含まれる場合は要素の有無そのものが切り替わるため報告する
        const hasDefinitelyNotText = classified.some((entry) =>
          isDefinitelyNotTextExpression(entry.leaf),
        )
        const skipString = !hasDefinitelyNotText && classified.some((entry) => !entry.info)

        targets.forEach(({ leaf, info }) => {
          if (info.isString && skipString) return

          report(leaf, info.label)
        })
      },
    }
  },
}
