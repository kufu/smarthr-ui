/**
 * @fileoverview functionsパターン(useLatest + functions)のuseMemo依存配列を制限するルール
 * @author SmartHR
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'useLatestが使われているコンポーネントでは、"functions"変数のuseMemo依存配列にlatestおよびhasXxxx形式の安定した値のみを許可する',
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
    const sourceCode = context.sourceCode || context.getSourceCode()
    const ALLOWED_NAME_PATTERN = /^has[A-Z]/

    // 同じスコープ(またはその祖先)にuseLatest()由来の`latest`変数があるかチェックする。
    // latestという選択肢がそもそも無いコンポーネントでは、このルールは適用しない
    function hasLatestInScope(node) {
      let currentScope = sourceCode.getScope(node)

      while (currentScope) {
        const variable = currentScope.set.get('latest')

        if (variable) {
          const def = variable.defs[0]

          return (
            def?.node.type === 'VariableDeclarator' &&
            def.node.init?.type === 'CallExpression' &&
            def.node.init.callee.type === 'Identifier' &&
            def.node.init.callee.name === 'useLatest'
          )
        }

        currentScope = currentScope.upper
      }

      return false
    }

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

        if (!hasLatestInScope(node)) {
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
