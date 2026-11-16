/**
 * @fileoverview Tests for best-practice-for-functions-deps rule
 */

const { RuleTester } = require('eslint')
const rule = require('./best-practice-for-functions-deps')

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

ruleTester.run('best-practice-for-functions-deps', rule, {
  valid: [
    // 依存配列にlatestのみ
    {
      code: `
        const functions = useMemo(() => ({
          handleClick: () => latest.onClick(),
        }), [latest])
      `,
    },

    // 依存配列にhasXxxx形式(外部から受け取る関数propの有無)とlatest
    {
      code: `
        const hasOnClick = Boolean(onClick)
        const functions = useMemo(() => ({
          handleClick: hasOnClick ? latest.onClick : undefined,
        }), [hasOnClick, latest])
      `,
    },

    // 依存配列が空
    {
      code: `
        const functions = useMemo(() => ({
          handleClick: () => {},
        }), [])
      `,
    },

    // functionsという名前でない変数はチェック対象外
    {
      code: `
        const other = useMemo(() => ({
          handleClick: () => setIsOpen(true),
        }), [setIsOpen])
      `,
    },

    // useMemoでない場合はチェック対象外
    {
      code: `
        const functions = useCallback(() => ({
          handleClick: () => setIsOpen(true),
        }), [setIsOpen])
      `,
    },

    // 依存配列がない場合はチェック対象外
    {
      code: `
        const functions = useMemo(() => ({
          handleClick: () => {},
        }))
      `,
    },
  ],

  invalid: [
    // 依存配列にsetter関数を直接含めている
    {
      code: `
        const functions = useMemo(() => ({
          handleTriggerClick: () => setIsOpen((prev) => !prev),
        }), [setIsOpen, latest])
      `,
      errors: [{ messageId: 'invalidDependency' }],
    },

    // 依存配列に通常の変数・関数を直接含めている
    {
      code: `
        const functions = useMemo(() => ({
          handleClick: () => {},
        }), [editor, handleDismiss, handleInserted, latest])
      `,
      errors: [
        { messageId: 'invalidDependency' },
        { messageId: 'invalidDependency' },
        { messageId: 'invalidDependency' },
      ],
    },

    // hasから始まるが命名規則(大文字開始)に合わないもの
    {
      code: `
        const functions = useMemo(() => ({
          handleClick: () => {},
        }), [hash, latest])
      `,
      errors: [{ messageId: 'invalidDependency' }],
    },

    // isXxxx形式はユーザー操作で変化しうる値であることが多いため許可しない
    {
      code: `
        const functions = useMemo(() => ({
          handleClick: () => {},
        }), [isExpanded, latest])
      `,
      errors: [{ messageId: 'invalidDependency' }],
    },
  ],
})
