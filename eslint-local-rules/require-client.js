/**
 * @fileoverview 'use client' ディレクティブの要否をチェックするルール
 * @author SmartHR
 *
 * 2つの方向をチェックする:
 * 1. 'use client' を持つファイルは client ディレクトリ配下に置かれているか
 * 2. コンポーネントファイル（ファイル名が大文字始まり）が client 専用 API を
 *    使っているのに 'use client' を持たない、ということがないか
 *
 * 2つ目のチェックでの client 専用 API 判定は3種類:
 * - react から import した Server Component で使えない API（実際に呼び出されているかまで見る）
 * - hooks/client/ 配下で定義されている hook 名（名前のみで判定。hooks/client/ 配下の
 *   ファイル自体は呼び出されなければ評価されないため 'use client' は不要で、使う側に必要になる）
 * - intl 関連の client 専用 hook 名
 *
 * hooks/client/・intl関連のhook名はハードコードしたリストで判定するため、
 * 新しい hook が追加された場合はこのファイルのリストも更新すること。
 * リポジトリ外のモジュールが提供する client 専用 hook は additionalClientHooks オプションで追加する。
 */

const path = require('node:path')

const isDirectivePrologueStatement = (node) =>
  node.type === 'ExpressionStatement' && node.directive !== undefined

const findUseClientDirective = (body) => {
  for (const statement of body) {
    if (!isDirectivePrologueStatement(statement)) {
      return undefined
    }
    if (statement.directive === 'use client') {
      return statement
    }
  }
  return undefined
}

// AGENTS.md「'use client' を付けるべきかの判定」記載の、Server Component で使えない React API
const REACT_CLIENT_ONLY_APIS = new Set([
  'useState',
  'useRef',
  'useEffect',
  'useLayoutEffect',
  'useContext',
  'useReducer',
  'useSyncExternalStore',
  'useImperativeHandle',
  'createContext',
])

// hooks/client/ 配下で定義されている hook 名（defineSV は状態を持たない定義用ヘルパーのため対象外）
const CLIENT_DIRECTORY_HOOK_NAMES = new Set([
  'useEnvironment',
  'useAnimationFrame',
  'useOnce',
  'useMergeRefs',
  'useSV',
  'useLayoutEffectRef',
  'useEscapeCallbackRef',
  'useTheme',
  'useAreaClickCallbackRef',
])

// src/intl 配下で定義されている client 専用 hook 名
const INTL_CLIENT_HOOK_NAMES = new Set(['useAvailableLocales', 'useDateFormat', 'useIntl', 'useLocalize'])

const isPascalCase = (name) => /^[A-Z]/.test(name)

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "'use client' ディレクティブの要否をチェックする",
      category: 'Best Practices',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          additionalClientHooks: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireClientDirectory:
        "'use client' ディレクティブを持つファイルは client ディレクトリ配下に置いてください。",
      requireUseClientDirective:
        "client専用のAPI（{{ name }}）を使用しているため、'use client' ディレクティブが必要です。",
    },
  },

  create(context) {
    const options = context.options[0]
    const additionalClientHooks = new Set(options?.additionalClientHooks ?? [])

    const filename = context.filename ?? context.getFilename()
    const cwd = context.cwd ?? context.getCwd()
    const basename = path.basename(filename, path.extname(filename))
    const isComponentFile = isPascalCase(basename)

    const reactClientApiLocalNames = new Map()
    let usedClientOnlyApiName

    return {
      ImportDeclaration(node) {
        if (node.source.value !== 'react') {
          return
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            REACT_CLIENT_ONLY_APIS.has(specifier.imported.name)
          ) {
            reactClientApiLocalNames.set(specifier.local.name, specifier.imported.name)
          }
        }
      },

      CallExpression(node) {
        if (usedClientOnlyApiName || node.callee.type !== 'Identifier') {
          return
        }

        const { name } = node.callee

        if (reactClientApiLocalNames.has(name)) {
          usedClientOnlyApiName = reactClientApiLocalNames.get(name)
        } else if (CLIENT_DIRECTORY_HOOK_NAMES.has(name) || INTL_CLIENT_HOOK_NAMES.has(name) || additionalClientHooks.has(name)) {
          usedClientOnlyApiName = name
        }
      },

      'Program:exit'(node) {
        const useClientStatement = findUseClientDirective(node.body)

        if (useClientStatement) {
          const relative = path.relative(cwd, filename)
          const normalized = relative.split(path.sep).join(path.posix.sep)
          const segments = normalized.split(path.posix.sep)

          if (!segments.includes('client')) {
            context.report({
              node: useClientStatement,
              messageId: 'requireClientDirectory',
            })
          }

          return
        }

        if (isComponentFile && usedClientOnlyApiName) {
          context.report({
            node,
            messageId: 'requireUseClientDirective',
            data: { name: usedClientOnlyApiName },
          })
        }
      },
    }
  },
}
