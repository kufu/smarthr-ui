/**
 * @fileoverview Tests for require-client-directory rule
 */

const { RuleTester } = require('eslint')
const rule = require('./require-client-directory')

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

ruleTester.run('require-client-directory', rule, {
  valid: [
    // 'use client' を持ち、client ディレクトリ配下にある
    {
      code: `
        'use client'

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/client/Foo.tsx',
    },

    // 'use client' を持ち、client 配下のネストしたディレクトリにある
    {
      code: `
        'use client'

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/client/components/Bar.tsx',
    },

    // 'use client' を持たず、client ディレクトリ配下にもない
    {
      code: `
        export const Foo = () => null
      `,
      filename: 'src/components/Foo/Foo.tsx',
    },

    // 'use client' を持たないファイルが client ディレクトリ配下にあってもよい
    {
      code: `
        export const useFoo = () => null
      `,
      filename: 'src/components/Foo/client/useFoo.ts',
    },

    // ファイル先頭以外に 'use client' という文字列だけの式文があっても、directive prologueではないため対象外
    {
      code: `
        const x = 1
        'use client'

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/Foo.tsx',
    },
  ],

  invalid: [
    // 'use client' を持つが、client ディレクトリ配下にない
    {
      code: `
        'use client'

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/Foo.tsx',
      errors: [{ messageId: 'requireClientDirectory' }],
    },

    // ダブルクォートの 'use client' でも検出する
    {
      code: `
        "use client"

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/Foo.tsx',
      errors: [{ messageId: 'requireClientDirectory' }],
    },

    // client という名前を含むが、ディレクトリとして一致しない(clientDirectory等)場合は許容しない
    {
      code: `
        'use client'

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/clientHelpers/Foo.tsx',
      errors: [{ messageId: 'requireClientDirectory' }],
    },
  ],
})
