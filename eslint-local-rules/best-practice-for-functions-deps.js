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
        '"functions"のuseMemo依存配列には "latest" または "hasXxxx" 形式の変数のみ含められます。functionsは関数を生成するもののため、再生成が必要な可能性はほぼありません。頻繁に変わる値はもちろん、関数内部から呼び出されるだけの値は、useLatestのlatest変数にまとめることで再作成が必要ないことをコードで明示できます。',
      noCallbackInFunctionsScope:
        '"{{name}}"は"functions"と同じスコープでuseCallbackとして宣言されています。functionsがある場合、同階層でuseCallbackを個別に使わずfunctions内にまとめてください。',
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

    // scope(functionsが宣言されている関数スコープそのもの。祖先スコープは辿らない)
    // 内で宣言された変数のうち、useCallback呼び出しに束縛されているものを全て返す。
    // 別コンポーネント・別フック(=別スコープ)のuseCallbackは対象外
    function getUseCallbackDeclarationsInScope(scope) {
      const declarations = []

      for (const variable of scope.variables) {
        for (const def of variable.defs) {
          if (def.node.type !== 'VariableDeclarator') continue

          const init = def.node.init

          if (
            init &&
            init.type === 'CallExpression' &&
            init.callee.type === 'Identifier' &&
            init.callee.name === 'useCallback'
          ) {
            declarations.push({ name: variable.name, node: def.node })
          }
        }
      }

      return declarations
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

        const scope = sourceCode.getScope(node)

        for (const { name, node: callbackDeclNode } of getUseCallbackDeclarationsInScope(scope)) {
          context.report({
            node: callbackDeclNode.init,
            messageId: 'noCallbackInFunctionsScope',
            data: { name },
          })
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
