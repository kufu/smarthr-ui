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
    // 正しい変数名(プロパティが使われている)
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          latest.onChange()
          latest.value
        }, [latest])
      `,
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

    // useLayoutEffectRef - 依存配列にlatestと他の依存（OK）
    {
      code: `
        const latest = useLatest({ onChange })
        const layoutEffectRef = useLayoutEffectRef((node) => {
          latest.onChange()
        }, [someValue, latest])
      `,
    },

    // useLatest()由来でないlatest変数（useState）
    {
      code: `
        const [latest, setLatest] = useState(null)
        const result = latest.value
      `,
    },

    // useLatest()由来でないlatest変数（配列の最新要素）
    {
      code: `
        const items = [1, 2, 3]
        const latest = items[items.length - 1]
        const result = Object.keys(latest)
      `,
    },

    // useLatest()由来でないlatest変数（スプレッド構文）
    {
      code: `
        const latest = { foo: 'bar' }
        const obj = { ...latest }
      `,
    },

    // useLatest()由来でないlatest変数（in演算子）
    {
      code: `
        const latest = { foo: 'bar' }
        if ('foo' in latest) {
          console.log('has foo')
        }
      `,
    },

    // useLatest()由来でないlatest変数（for...in）
    {
      code: `
        const latest = { foo: 'bar' }
        for (const key in latest) {
          console.log(key)
        }
      `,
    },

    // useEffect - 依存配列にlatestのみ（OK）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          latest.onChange()
        }, [latest])
      `,
    },

    // useLayoutEffect - 依存配列にlatestのみ（OK）
    {
      code: `
        const latest = useLatest({ ref })
        useLayoutEffect(() => {
          latest.ref.current.focus()
        }, [latest])
      `,
    },

    // useMemo - 依存配列にlatestのみ（OK）
    {
      code: `
        const latest = useLatest({ value })
        const result = useMemo(() => {
          return latest.value * 2
        }, [latest])
      `,
    },

    // useMemo - 依存配列にlatestと他の依存（OK）
    {
      code: `
        const latest = useLatest({ onChange })
        const result = useMemo(() => {
          latest.onChange()
          return count
        }, [count, latest])
      `,
    },

    // フック直下でlatest.xxxを関数でラップしている（OK）
    {
      code: `
        const latest = useLatest({ onClick })
        const functions = useMemo(() => ({
          handleClick: () => latest.onClick(),
        }), [latest])
      `,
    },

    // フック直下でlatest.xxx()の呼び出し結果を関数でラップしている（OK）
    {
      code: `
        const latest = useLatest({ getHandlers })
        useEffect(() => {
          const run = () => {
            const { onRun } = latest.getHandlers()
            onRun()
          }
          run()
        }, [latest])
      `,
    },

    // ネストしたローカル関数の中でlatest.xxxを変数に代入（OK、呼ばれるたびに再評価される）
    {
      code: `
        const latest = useLatest({ value })
        useEffect(() => {
          const evaluate = () => {
            const current = latest.value
            if (!current) return
          }
          evaluate()
        }, [latest])
      `,
    },

    // ネストしたローカル関数がFunctionDeclaration(function宣言)の場合もOK
    // (evaluate内のreturnは外側のuseEffectの戻り値ではない)
    {
      code: `
        const latest = useLatest({ value })
        useEffect(() => {
          function evaluate() {
            const current = latest.value
            return current
          }
          evaluate()
        }, [latest])
      `,
    },

    // フック直下でもlatest.xxxRef.currentはRefObjectのcurrent参照と名前から自明なため対象外（OK）
    {
      code: `
        const latest = useLatest({ containerRef })
        useEffect(() => {
          const container = latest.containerRef.current
          if (!container) return
        }, [latest])
      `,
    },

    // latest自体をオブジェクトプロパティの値としてアロー関数内で参照（OK、代入ではない）
    {
      code: `
        const latest = useLatest({ onClick, hasValue })
        const functions = useMemo(() => ({
          handleClick: () => (latest.hasValue ? latest.onClick() : undefined),
        }), [latest])
      `,
    },

    // useCallbackのコールバック直下での代入はOK(呼ばれるたびに本体が再評価されるため)
    {
      code: `
        const latest = useLatest({ addDisclosureChangeListener })
        const callbackRef = useCallback((node) => {
          const remove = latest.addDisclosureChangeListener()
        }, [latest])
      `,
    },

    // useCallback直下でMemberExpressionをそのまま代入してもOK
    {
      code: `
        const latest = useLatest({ listBoxFunctions })
        const handleClick = useCallback(() => {
          const onSelect = latest.listBoxFunctions.handleSelect
          onSelect()
        }, [latest])
      `,
    },

    // const { xxxx } = latest のような分割代入でプロパティを受け取った場合もOK
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const { onChange, value } = latest
          onChange(value)
        }, [latest])
      `,
    },

    // 分割代入でrest要素(...rest)を使っている場合は、どのキーが使われるか静的に
    // 追跡できないため安全側に倒し、未使用警告を出さない
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const { ...rest } = latest
          doSomething(rest)
        }, [latest])
      `,
    },

    // フック直下で代入しても、同じスコープ内でその場の計算にのみ使われていればOK
    // (ネストした関数にも、returnの戻り値にも渡されていない)
    {
      code: `
        const latest = useLatest({ defaultPosition, top })
        useLayoutEffectRef((node) => {
          if (node) {
            const oldDefaultPosition = latest.defaultPosition
            const nextDefaultPosition =
              oldDefaultPosition.top === latest.top ? oldDefaultPosition : { top: latest.top }
            setDefaultPosition(nextDefaultPosition)
          }
        }, [latest])
      `,
    },

    // フック直下で代入した値を、計算式に使って新しい値を作りsetStateに渡すのはOK
    {
      code: `
        const latest = useLatest({ getSafeAreaInsets })
        useLayoutEffectRef((node) => {
          const safeAreaInsets = latest.getSafeAreaInsets()
          const safeHeight = window.innerHeight - safeAreaInsets.top
          setHeight(safeHeight)
        }, [latest])
      `,
    },

    // useLatestの引数に算出プロパティ名(computed property)が含まれる場合は
    // 静的に追跡できないため安全側に倒してチェックをスキップする(未使用警告を出さない)
    {
      code: `
        const latest = useLatest({ [key]: value, onChange })
        useEffect(() => {
          latest.onChange()
        }, [latest])
      `,
    },

    // 分割代入が算出プロパティ(const { [key]: x } = latest)の場合は
    // どのキーが使われるか静的に追跡できないため安全側に倒す(未使用警告を出さない)
    {
      code: `
        const latest = useLatest({ value, onChange })
        useEffect(() => {
          const { [key]: selected } = latest
          onChange(selected)
        }, [latest])
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
      errors: [{ messageId: 'unusedProperty' }, { messageId: 'noLatestItself' }],
    },

    // latest自体を関数に渡す（フック内）
    {
      code: `
        const latest = useLatest({ onChange })
        useEffect(() => {
          doSomething(latest)
        }, [latest])
      `,
      errors: [{ messageId: 'unusedProperty' }, { messageId: 'noLatestItself' }],
    },

    // latest自体を配列に含める（フック内）
    {
      code: `
        const latest = useLatest({ ref })
        useEffect(() => {
          const refs = [latest]
        }, [latest])
      `,
      errors: [{ messageId: 'unusedProperty' }, { messageId: 'noLatestItself' }],
    },

    // latest自体をオブジェクトに含める（フック内）
    {
      code: `
        const latest = useLatest({ ref })
        useEffect(() => {
          const obj = { ref: latest }
        }, [latest])
      `,
      errors: [{ messageId: 'unusedProperty' }, { messageId: 'noLatestItself' }],
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

    // スプレッド構文の使用（オブジェクト）
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const obj = { ...latest }
        }, [latest])
      `,
      errors: [
        { messageId: 'unusedProperty' },
        { messageId: 'unusedProperty' },
        { messageId: 'noSpread' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'unusedProperty' },
        { messageId: 'noSpread' },
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
      errors: [{ messageId: 'unusedProperty' }, { messageId: 'noInOperator' }],
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
        { messageId: 'unusedProperty' },
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'noObjectMethods' },
        { messageId: 'noLatestItself' },
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
        { messageId: 'unusedProperty' },
        { messageId: 'unusedProperty' },
        { messageId: 'noForIn' },
      ],
    },

    // フック直下でlatest.xxxを変数にそのまま代入(MemberExpression)
    {
      code: `
        const latest = useLatest({ listBoxFunctions })
        const functions = useMemo(() => {
          const handleDelete = latest.listBoxFunctions.handleDelete
          return { handleDelete }
        }, [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // フック直下でlatest.xxx.yyyを変数に代入し、ネストしたローカル関数(後で呼ばれる)の中で使う
    {
      code: `
        const latest = useLatest({ listBoxFunctions })
        useEffect(() => {
          const onSelect = latest.listBoxFunctions.handleSelect
          const handler = () => onSelect()
          document.addEventListener('click', handler)
          return () => document.removeEventListener('click', handler)
        }, [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // ネストしたローカル関数がFunctionDeclaration(function宣言)の場合も検知する
    {
      code: `
        const latest = useLatest({ onSelect })
        useEffect(() => {
          const onSelect = latest.onSelect
          function handler() {
            onSelect()
          }
          document.addEventListener('click', handler)
          return () => document.removeEventListener('click', handler)
        }, [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // フック直下でlatest.xxx()の呼び出し結果をそのまま分割代入(分割代入は常に保守的にエラー)
    {
      code: `
        const latest = useLatest({ getVideoHandlers })
        useEffect(() => {
          const { loadVideos } = latest.getVideoHandlers()
          loadVideos()
        }, [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // useLayoutEffectRefでも同様に検知する(returnの戻り値としてそのまま公開される)
    {
      code: `
        const latest = useLatest({ onChange })
        const layoutEffectRef = useLayoutEffectRef((node) => {
          const onChange = latest.onChange
          return { onChange }
        }, [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // 変数を経由せず、戻り値オブジェクトのプロパティとして直接latest.xxxを公開している
    {
      code: `
        const latest = useLatest({ onXxxx })
        const functions = useMemo(() => {
          return { onXxxx: latest.onXxxx }
        }, [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // 変数を経由せず、戻り値オブジェクトのプロパティとして直接latest.xxx()の呼び出し結果を公開している
    {
      code: `
        const latest = useLatest({ getHandlers })
        useEffect(() => {
          return { onRun: latest.getHandlers() }
        }, [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // 暗黙return(アロー関数の()=>({...})形式)でも同様に検知する
    {
      code: `
        const latest = useLatest({ onClick })
        const functions = useMemo(() => ({
          onClick: latest.onClick,
        }), [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // 計算プロパティ名(computed property)でも同様に検知する
    {
      code: `
        const latest = useLatest({ onClick })
        const functions = useMemo(() => ({
          ['onClick']: latest.onClick,
        }), [latest])
      `,
      errors: [{ messageId: 'noEagerCapture' }],
    },

    // useLatestに渡したプロパティがどこからも使われていない
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          latest.onChange()
        }, [latest])
      `,
      errors: [{ messageId: 'unusedProperty', data: { name: 'value' } }],
    },

    // 分割代入で一部のプロパティのみ受け取り、残りが未使用
    {
      code: `
        const latest = useLatest({ onChange, value })
        useEffect(() => {
          const { onChange } = latest
          onChange()
        }, [latest])
      `,
      errors: [{ messageId: 'unusedProperty', data: { name: 'value' } }],
    },

    // 分割代入の文字列リテラルキー(非computed)も使用済みとして扱う
    {
      code: `
        const latest = useLatest({ value, onChange })
        useEffect(() => {
          const { 'value': selected } = latest
          onChange(selected)
        }, [latest])
      `,
      errors: [{ messageId: 'unusedProperty', data: { name: 'onChange' } }],
    },
  ],
})

console.log('All tests passed!')
