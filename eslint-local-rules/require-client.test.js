/**
 * @fileoverview Tests for require-client rule
 */

const assert = require('node:assert')
const test = require('node:test')

const { RuleTester } = require('eslint')
const rule = require('./require-client')

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

ruleTester.run('require-client', rule, {
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

    // 'use client' を持たず、client ディレクトリ配下にもない。client専用APIも使わない
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

    // directive prologueではない括弧付き文字列式は 'use client' として扱わない
    {
      code: `
        ('use client')

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/Foo.tsx',
    },

    // コンポーネントファイルでなければreact client専用APIを使っていても対象外（hook自体のファイル）
    {
      code: `
        import { useRef } from 'react'

        export const useLayoutEffectRef = () => { useRef(null) }
      `,
      filename: 'src/hooks/client/useLayoutEffectRef.ts',
    },

    // コンポーネントファイルでも、Server Componentで使えるreact APIだけなら不要
    {
      code: `
        import { useMemo, useCallback, useId } from 'react'

        export const Foo = () => {
          useMemo(() => 1, [])
          useCallback(() => {}, [])
          useId()
          return null
        }
      `,
      filename: 'src/components/Foo/Foo.tsx',
    },

    // react以外のモジュールから同名の関数をimportしていても対象外（nameだけの一致で誤検知しない）
    {
      code: `
        import { useState } from './myCustomHooks'

        export const Foo = () => {
          useState()
          return null
        }
      `,
      filename: 'src/components/Foo/Foo.tsx',
    },

    // コンポーネントファイルがclient専用APIを使い、'use client'も持っている
    {
      code: `
        'use client'

        import { useState } from 'react'

        export const Foo = () => {
          const [value] = useState(0)
          return value
        }
      `,
      filename: 'src/components/Foo/client/Foo.tsx',
    },

    // hooks/client/ 配下のhookを使っていても、'use client'を持っていればよい
    {
      code: `
        'use client'

        import { useMergeRefs } from '../../../hooks/client/useMergeRefs'

        export const Foo = () => {
          useMergeRefs()
          return null
        }
      `,
      filename: 'src/components/Foo/client/Foo.tsx',
    },

    // additionalClientHooksで指定した名前を使っていても、'use client'を持っていればよい
    {
      code: `
        'use client'

        import { useCustomClientHook } from 'some-external-package'

        export const Foo = () => {
          useCustomClientHook()
          return null
        }
      `,
      filename: 'src/components/Foo/client/Foo.tsx',
      options: [{ additionalClientHooks: ['useCustomClientHook'] }],
    },

    // defineSVは対象外
    {
      code: `
        import { defineSV } from '../../hooks/client/useSV'

        defineSV({})

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

    // 'use strict' など他のdirectiveの後に 'use client' が続く場合も検出する
    {
      code: `
        'use strict'
        'use client'

        export const Foo = () => null
      `,
      filename: 'src/components/Foo/Foo.tsx',
      errors: [{ messageId: 'requireClientDirectory' }],
    },

    // コンポーネントファイルがreact client専用APIを使っているのに'use client'がない
    {
      code: `
        import { useState } from 'react'

        export const Foo = () => {
          const [value] = useState(0)
          return value
        }
      `,
      filename: 'src/components/Foo/Foo.tsx',
      errors: [{ messageId: 'requireUseClientDirective', data: { name: 'useState' } }],
    },

    // createContextをモジュールスコープで呼んでいるのに'use client'がない
    {
      code: `
        import { createContext } from 'react'

        export const FooContext = createContext(null)
      `,
      filename: 'src/components/FooContext.ts',
      errors: [{ messageId: 'requireUseClientDirective', data: { name: 'createContext' } }],
    },

    // hooks/client/ 配下のhookを名前だけで検知する（import元のパスは問わない）
    {
      code: `
        import { useMergeRefs } from '../../../hooks/client/useMergeRefs'

        export const Foo = () => {
          useMergeRefs()
          return null
        }
      `,
      filename: 'src/components/Foo/Foo.tsx',
      errors: [{ messageId: 'requireUseClientDirective', data: { name: 'useMergeRefs' } }],
    },

    // intl関連hookを使っているのに'use client'がない
    {
      code: `
        import { useIntl } from '../../intl'

        export const Foo = () => {
          useIntl()
          return null
        }
      `,
      filename: 'src/components/Foo/Foo.tsx',
      errors: [{ messageId: 'requireUseClientDirective', data: { name: 'useIntl' } }],
    },

    // additionalClientHooksで指定した名前を使っているのに'use client'がない
    {
      code: `
        import { useCustomClientHook } from 'some-external-package'

        export const Foo = () => {
          useCustomClientHook()
          return null
        }
      `,
      filename: 'src/components/Foo/Foo.tsx',
      options: [{ additionalClientHooks: ['useCustomClientHook'] }],
      errors: [{ messageId: 'requireUseClientDirective', data: { name: 'useCustomClientHook' } }],
    },
  ],
})

// RuleTesterはcwdをテストケースごとに変更できないため、リポジトリ自体が
// `client`という名前を含むディレクトリ配下に置かれているケースはcontext.cwd/filenameを
// 直接渡してcreate()を呼び出し検証する
test('リポジトリ外側の親ディレクトリ名に client が含まれていても判定に影響しない', () => {
  const programNode = {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        directive: 'use client',
        expression: { type: 'Literal', value: 'use client' },
      },
    ],
  }
  const reports = []
  const context = {
    cwd: '/workspace/client/smarthr-ui',
    filename: '/workspace/client/smarthr-ui/packages/smarthr-ui/src/components/Foo/Foo.tsx',
    options: [],
    report: (descriptor) => reports.push(descriptor),
  }

  const listeners = rule.create(context)

  listeners['Program:exit'](programNode)

  assert.strictEqual(reports.length, 1)
  assert.strictEqual(reports[0].messageId, 'requireClientDirectory')
})
