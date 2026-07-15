/**
 * @fileoverview Tests for best-practice-for-use-latest rule
 */

const { RuleTester } = require('eslint')
const rule = require('./best-practice-for-use-latest')

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

ruleTester.run('best-practice-for-use-latest', rule, {
  valid: [
    // 正しい変数名
    {
      code: 'const latest = useLatest({ onChange, value })',
    },

    // 依存配列にlatest自体を最後尾に配置
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [dep1, dep2, latest])
      `,
    },

    // useCallback - 依存配列にlatestのみ（OK）
    {
      code: `
        const latest = useLatest({ onChange })
        const callback = useCallback(() => {
          latest.onChange()
        }, [latest])
      `,
    },

    // useEffect - 依存配列にlatestと他の依存（OK）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [someValue, latest])
      `,
    },
  ],

  invalid: [
    // 間違った変数名
    {
      code: 'const ref = useLatest({ onChange })',
      errors: [{ messageId: 'invalidVariableName' }],
    },
    {
      code: 'const latestRef = useLatest({ onChange })',
      errors: [{ messageId: 'invalidVariableName' }],
    },

    // 分割代入で受け取る
    {
      code: 'const { onChange } = useLatest({ onChange })',
      errors: [{ messageId: 'noDestructuring' }],
    },

    // トップレベルでのプロパティアクセス
    {
      code: `
        const latest = useLatest({ value })
        const result = latest.value
      `,
      errors: [{ messageId: 'noUsageOutsideHook' }],
    },

    // トップレベルでの分割代入
    {
      code: `
        const latest = useLatest({ onChange })
        const { onChange } = latest
      `,
      errors: [{ messageId: 'noUsageOutsideHook' }],
    },

    // Reactコンポーネント内のトップレベル（関数内だが短いメッセージ）
    {
      code: `
        function MyComponent() {
          const latest = useLatest({ value: 1 })
          const result = latest.value
          return result
        }
      `,
      errors: [{ messageId: 'noUsageOutsideHook' }],
    },

    // イベントハンドラ等の関数内（ネストした関数内なので長いメッセージ）
    {
      code: `
        function MyComponent() {
          const latest = useLatest({ onChange })
          const handleClick = () => {
            latest.onChange()
          }
          return handleClick
        }
      `,
      errors: [{ messageId: 'noUsageOutsideHookInFunction' }],
    },

    // イベントハンドラ内での分割代入（ネストした関数内なので長いメッセージ）
    {
      code: `
        function MyComponent() {
          const latest = useLatest({ onChange })
          function handleClick() {
            const { onChange } = latest
            onChange()
          }
          return handleClick
        }
      `,
      errors: [{ messageId: 'noUsageOutsideHookInFunction' }],
    },

    // latest自体を変数に代入（フック内）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          const ref = latest
        }, [latest])
      `,
      errors: [
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // latest自体を関数に渡す（フック内）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          doSomething(latest)
        }, [latest])
      `,
      errors: [
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // latest自体を配列に含める（フック内）
    {
      code: `
        const latest = useLatest({ ref })
        useEffect(() => {
          const refs = [latest]
        }, [latest])
      `,
      errors: [
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // latest自体をオブジェクトに含める（フック内）
    {
      code: `
        const latest = useLatest({ ref })
        useEffect(() => {
          const obj = { ref: latest }
        }, [latest])
      `,
      errors: [
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // 依存配列にプロパティアクセスを含める
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [latest.onChange])
      `,
      errors: [{ messageId: 'noPropertyInDeps' }],
    },

    // 依存配列にプロパティアクセスを含める（複数）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [dep1, latest.onChange])
      `,
      errors: [{ messageId: 'noPropertyInDeps' }],
    },

    // latestが最後尾でない
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [latest, dep1])
      `,
      errors: [{ messageId: 'latestMustBeLastInDeps' }],
    },

    // latestが最後尾でない（複数の依存）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [latest, dep1, dep2])
      `,
      errors: [{ messageId: 'latestMustBeLastInDeps' }],
    },

    // useEffect - 依存配列がlatestのみ
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [latest])
      `,
      errors: [{ messageId: 'latestOnlyDepsInEffect' }],
    },

    // useLayoutEffect - 依存配列がlatestのみ
    {
      code: `
        const latest = useLatest({ ref })
        useLayoutEffect(() => {
          latest.ref.current.focus()
        }, [latest])
      `,
      errors: [{ messageId: 'latestOnlyDepsInEffect' }],
    },

    // useMemo - 依存配列がlatestのみ
    {
      code: `
        const latest = useLatest({ value })
        const result = useMemo(() => {
          return latest.value * 2
        }, [latest])
      `,
      errors: [
        { messageId: 'noUsageOutsideHook' },
        { messageId: 'noLatestInUseMemo' },
        { messageId: 'noLatestItself' },
      ],
    },

    // スプレッド構文の使用（オブジェクト）
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const obj = { ...latest }
        }, [latest])
      `,
      errors: [
        { messageId: 'noSpread' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // スプレッド構文の使用（配列）
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const arr = [...latest]
        }, [latest])
      `,
      errors: [
        { messageId: 'noSpread' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // in演算子の使用
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          if ('onChange' in latest) {
            console.log('has onChange')
          }
        }, [latest])
      `,
      errors: [
        { messageId: 'noInOperator' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.keysの使用
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const keys = Object.keys(latest)
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.valuesの使用
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const values = Object.values(latest)
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.entriesの使用
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const entries = Object.entries(latest)
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.assignの使用（第2引数以降）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          const obj = Object.assign({}, latest)
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.assignの使用（第1引数）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          const obj = Object.assign(latest, { foo: 'bar' })
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.createの使用
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          const obj = Object.create(latest)
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.definePropertyの使用
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          Object.defineProperty(latest, 'foo', { value: 'bar' })
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // Object.freezeの使用
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          Object.freeze(latest)
        }, [latest])
      `,
      errors: [
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // for...inループの使用
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          for (const key in latest) {
            console.log(key)
          }
        }, [latest])
      `,
      errors: [
        { messageId: 'noForIn' },
        { messageId: 'latestOnlyDepsInEffect' },
      ],
    },

    // useMemoの依存配列にlatestを含める（他の依存と混在）
    {
      code: `
        const latest = useLatest({ onChange })
        const result = useMemo(() => {
          latest.onChange()
          return count
        }, [count, latest])
      `,
      errors: [
        { messageId: 'noUsageOutsideHook' },
        { messageId: 'noLatestInUseMemo' },
        { messageId: 'noLatestItself' },
      ],
    },
  ],
})

console.log('All tests passed!')
