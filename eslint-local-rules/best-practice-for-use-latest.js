/**
 * @fileoverview useLatestフックの使用方法を制限するルール
 * @author SmartHR
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'useLatestの使用方法を制限し、安全な利用を強制する',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidVariableName:
        'useLatestの返り値は "latest" という変数名で受け取る必要があります。',
      noDestructuring: 'useLatestの返り値を分割代入で受け取ることはできません。',
      noUsageOutsideHook:
        'latest変数はuseEffect、useLayoutEffect、useCallback内でのみ使用できます。',
      noUsageOutsideHookInFunction:
        'latest変数はuseEffect、useLayoutEffect、useCallback内でのみ使用できます。関数内で使用する場合はuseCallbackでラップしてください。または、latest経由ではなく値を直接参照することを検討してください。',
      noLatestItself:
        'latest自体を使用することはできません。latest.xxxのようにプロパティアクセスするか、const { xxx } = latestのように分割代入してください。',
      noPropertyInDeps:
        '依存配列にはlatestのプロパティ（latest.current等）を含めることはできません。latest自体を含めてください。',
      latestMustBeLastInDeps:
        'latestを依存配列に含める場合は、最後尾に配置してください。',
      latestOnlyDepsInEffect:
        'useEffect/useLayoutEffectの依存配列にlatestのみを含めても意味がありません。依存配列を空にして、latest.xxxではなく値を直接使用してください。',
      noLatestInUseMemo:
        'useMemoの依存配列にlatestを含めることはできません。useCallbackを使用するか、値を直接参照してください。',
      noSpread:
        'latestに対してスプレッド構文（...latest）を使用することはできません。latest.xxxのようにプロパティアクセスしてください。',
      noInOperator:
        'latestに対してin演算子を使用することはできません。latest.xxxのようにプロパティアクセスしてください。',
      noObjectMethods:
        'latestに対してObject.keys/values/entries等を使用することはできません。latest.xxxのようにプロパティアクセスしてください。',
      noForIn:
        'latestに対してfor...inループを使用することはできません。latest.xxxのようにプロパティアクセスしてください。',
    },
    schema: [],
  },

  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode()

    /**
     * ノードがuseEffect/useLayoutEffect/useCallback内にあるかチェック
     */
    function isInsideAllowedHook(node) {
      let parent = node.parent
      while (parent) {
        if (
          parent.type === 'CallExpression' &&
          parent.callee.type === 'Identifier' &&
          /^use((Layout)?Effect|Callback)$/.test(parent.callee.name)
        ) {
          return true
        }
        parent = parent.parent
      }
      return false
    }

    /**
     * ノードがネストした関数内にあるかチェック
     * （Reactコンポーネント自体は除外し、その中のイベントハンドラ等の関数を検出）
     */
    function isInsideNestedFunction(node) {
      let functionCount = 0
      let parent = node.parent
      while (parent) {
        if (
          parent.type === 'ArrowFunctionExpression' ||
          parent.type === 'FunctionExpression' ||
          parent.type === 'FunctionDeclaration'
        ) {
          functionCount++
        }
        parent = parent.parent
      }
      // 関数が2つ以上ネストしている場合は、イベントハンドラ等の内側の関数
      return functionCount >= 2
    }

    /**
     * ノードが依存配列内にあるかチェック
     */
    function isInsideDependencyArray(node) {
      let parent = node.parent
      while (parent) {
        // ArrayExpression内で、その親がCallExpressionの第2引数かチェック
        if (parent.type === 'ArrayExpression') {
          const grandParent = parent.parent
          if (
            grandParent &&
            grandParent.type === 'CallExpression' &&
            grandParent.callee.type === 'Identifier' &&
            /^use((Layout)?Effect|Callback)$/.test(grandParent.callee.name) &&
            grandParent.arguments[1] === parent
          ) {
            return true
          }
        }
        parent = parent.parent
      }
      return false
    }

    return {
      // 1. 変数宣言のチェック
      VariableDeclarator(node) {
        // useLatest呼び出しかチェック
        if (
          !node.init ||
          node.init.type !== 'CallExpression' ||
          node.init.callee.type !== 'Identifier' ||
          node.init.callee.name !== 'useLatest'
        ) {
          return
        }

        // 分割代入をチェック
        if (node.id.type === 'ObjectPattern' || node.id.type === 'ArrayPattern') {
          context.report({
            node: node.id,
            messageId: 'noDestructuring',
          })
          return
        }

        // 変数名をチェック
        if (node.id.type === 'Identifier' && node.id.name !== 'latest') {
          context.report({
            node: node.id,
            messageId: 'invalidVariableName',
          })
        }
      },

      // 2. latest使用のチェック
      'Identifier[name="latest"]'(node) {
        const parent = node.parent

        // 変数宣言の左辺はスキップ
        if (parent.type === 'VariableDeclarator' && parent.id === node) {
          return
        }

        // スプレッド構文、in演算子、for...inループ、Object.*メソッドは
        // それぞれ専用のチェックで処理するのでスキップ
        switch (parent.type) {
          case 'SpreadElement':
            if (parent.argument === node) return
            break
          case 'BinaryExpression':
            if (parent.operator === 'in' && parent.right === node) return
            break
          case 'ForInStatement':
            if (parent.right === node) return
            break
          case 'CallExpression':
            // Object.*メソッドの引数として使われている場合もスキップ
            if (
              parent.callee.type === 'MemberExpression' &&
              parent.callee.object.type === 'Identifier' &&
              parent.callee.object.name === 'Object' &&
              parent.arguments.includes(node)
            ) {
              return
            }
            break
        }

        // 依存配列内での使用
        if (isInsideDependencyArray(node)) {
          // MemberExpression（latest.xxx）の場合はエラー
          if (parent.type === 'MemberExpression' && parent.object === node) {
            context.report({
              node,
              messageId: 'noPropertyInDeps',
            })
          }
          // latest自体の場合は位置チェック（後で実施）
          return
        }

        // MemberExpression（latest.xxx）の場合
        if (parent.type === 'MemberExpression' && parent.object === node) {
          // フック外での使用はエラー
          if (!isInsideAllowedHook(node)) {
            context.report({
              node,
              messageId: isInsideNestedFunction(node) ? 'noUsageOutsideHookInFunction' : 'noUsageOutsideHook',
            })
          }
          // フック内ならOK
          return
        }

        // VariableDeclaratorのinitで、idがObjectPattern（分割代入）
        if (
          parent.type === 'VariableDeclarator' &&
          parent.init === node &&
          parent.id.type === 'ObjectPattern'
        ) {
          // フック外での使用はエラー
          if (!isInsideAllowedHook(node)) {
            context.report({
              node,
              messageId: isInsideNestedFunction(node) ? 'noUsageOutsideHookInFunction' : 'noUsageOutsideHook',
            })
          }
          // フック内ならOK
          return
        }

        // それ以外の使用（latest自体の代入、関数引数等）は常にエラー
        context.report({
          node,
          messageId: 'noLatestItself',
        })
      },

      // 3. CallExpressionのチェック（依存配列、Object.*メソッド）
      CallExpression(node) {
        // 3-1. Object.keys/values/entries等のチェック
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'Object' &&
          node.callee.property.type === 'Identifier' &&
          /^(keys|values|entries|getOwnPropertyNames|getOwnPropertyDescriptors|getOwnPropertySymbols|assign|freeze|seal|preventExtensions)$/.test(
            node.callee.property.name,
          )
        ) {
          // Object.assignの場合は第二引数以降も、それ以外は第一引数をチェック
          const argsToCheck = node.callee.property.name === 'assign' ? node.arguments.slice(1) : node.arguments.slice(0, 1)

          for (const arg of argsToCheck) {
            if (arg.type === 'Identifier' && arg.name === 'latest') {
              context.report({
                node: arg,
                messageId: 'noObjectMethods',
              })
              break
            }
          }
        }

        // 3-2. use*フックの依存配列のチェック
        if (
          node.callee.type === 'Identifier' &&
          /^use((Layout)?Effect|Callback|Memo)$/.test(node.callee.name)
        ) {
          const hookName = node.callee.name
          const depsArg = node.arguments[1]

          if (depsArg && depsArg.type === 'ArrayExpression') {
            const elements = depsArg.elements.filter((el) => el !== null)
            const latestIndex = elements.findIndex(
              (el) => el.type === 'Identifier' && el.name === 'latest',
            )

            if (latestIndex !== -1) {
              // useMemoでは依存配列にlatestを含めることを禁止
              if (hookName === 'useMemo') {
                context.report({
                  node: elements[latestIndex],
                  messageId: 'noLatestInUseMemo',
                })
                return
              }

              // useEffect/useLayoutEffectで依存配列がlatestのみの場合
              if (/^use(Layout)?Effect$/.test(hookName)) {
                if (elements.length === 1 && elements[0].name === 'latest') {
                  context.report({
                    node: elements[0],
                    messageId: 'latestOnlyDepsInEffect',
                  })
                  return
                }
              }

              // latestが含まれていて、最後尾でない場合
              if (latestIndex !== elements.length - 1) {
                context.report({
                  node: elements[latestIndex],
                  messageId: 'latestMustBeLastInDeps',
                })
              }
            }
          }
        }
      },

      // 4. スプレッド構文のチェック
      SpreadElement(node) {
        if (node.argument.type === 'Identifier' && node.argument.name === 'latest') {
          context.report({
            node: node.argument,
            messageId: 'noSpread',
          })
        }
      },

      // 5. in演算子のチェック
      'BinaryExpression[operator="in"]'(node) {
        if (node.right.type === 'Identifier' && node.right.name === 'latest') {
          context.report({
            node: node.right,
            messageId: 'noInOperator',
          })
        }
      },

      // 6. for...inループのチェック
      ForInStatement(node) {
        if (node.right.type === 'Identifier' && node.right.name === 'latest') {
          context.report({
            node: node.right,
            messageId: 'noForIn',
          })
        }
      },
    }
  },
}
