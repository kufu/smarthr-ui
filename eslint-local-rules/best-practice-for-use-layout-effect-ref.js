/**
 * @fileoverview useLayoutEffectRefの依存配列が空の場合、useCallbackへの変更を促すルール
 * @author SmartHR
 */

const SELECTOR =
  "CallExpression[callee.name='useLayoutEffectRef'][arguments.1.type='ArrayExpression'][arguments.1.elements.length=0]"

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'useLayoutEffectRefの依存配列が空の場合、より軽量なuseCallbackへの変更を促す',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      preferUseCallback:
        'useLayoutEffectRefの依存配列が空の場合、dependencies変化時の再実行という利点がないため、useCallbackへ変更してください。',
    },
  },

  create(context) {
    return {
      [SELECTOR](node) {
        context.report({
          node: node.callee,
          messageId: 'preferUseCallback',
        })
      },
    }
  },
}
