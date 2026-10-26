/**
 * @fileoverview Tests for best-practice-for-use-layout-effect-ref rule
 */

const { RuleTester } = require('eslint')
const rule = require('./best-practice-for-use-layout-effect-ref')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('best-practice-for-use-layout-effect-ref', rule, {
  valid: [
    // 依存配列が空でない
    {
      code: `
        const ref = useLayoutEffectRef(action, [dep])
      `,
    },

    // 依存配列に複数の要素
    {
      code: `
        const ref = useLayoutEffectRef(action, [dep1, dep2])
      `,
    },

    // 別のフック呼び出し(useLayoutEffectRefではない)
    {
      code: `
        const ref = useCallback(action, [])
      `,
    },

    // 依存配列の引数がArrayExpressionでない(変数経由など、静的に空と判断できない)
    {
      code: `
        const ref = useLayoutEffectRef(action, dependencies)
      `,
    },
  ],

  invalid: [
    // 依存配列が空
    {
      code: `
        const ref = useLayoutEffectRef((node) => {
          if (!node) return
          node.focus()
        }, [])
      `,
      errors: [{ messageId: 'preferUseCallback' }],
    },

    // 同一ファイル内に依存配列が空でない呼び出しが混在していても、空の呼び出しだけ検出する
    {
      code: `
        const refA = useLayoutEffectRef((node) => {}, [])
        const refB = useLayoutEffectRef((node) => {}, [dep])
      `,
      errors: [{ messageId: 'preferUseCallback' }],
    },
  ],
})
