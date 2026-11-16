/**
 * @fileoverview functionsパターン(useLatest + functions)のuseMemo依存配列を制限するルール
 * @author SmartHR
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        '"functions"変数のuseMemo依存配列には、latestおよびhasXxxx形式の安定した値のみを許可する',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidDependency:
        '"functions"のuseMemo依存配列には "latest" または "hasXxxx" 形式の変数のみ含められます。頻繁に変更される値は再作成を招くため、useLatestにまとめて latest 経由で参照してください。',
    },
    schema: [],
  },

  create(context) {
    const ALLOWED_NAME_PATTERN = /^has[A-Z]/

    return {
      VariableDeclarator(node) {
        if (
          node.id.type !== 'Identifier' ||
          node.id.name !== 'functions' ||
          !node.init ||
          node.init.type !== 'CallExpression' ||
          node.init.callee.type !== 'Identifier' ||
          node.init.callee.name !== 'useMemo'
        ) {
          return
        }

        const depsArg = node.init.arguments[1]

        if (!depsArg || depsArg.type !== 'ArrayExpression') {
          return
        }

        for (const el of depsArg.elements) {
          if (el === null) continue

          if (
            el.type === 'Identifier' &&
            (el.name === 'latest' || ALLOWED_NAME_PATTERN.test(el.name))
          ) {
            continue
          }

          context.report({
            node: el,
            messageId: 'invalidDependency',
          })
        }
      },
    }
  },
}
