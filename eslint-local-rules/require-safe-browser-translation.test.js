/**
 * @fileoverview Tests for require-safe-browser-translation rule
 */

const test = require('node:test')

const { RuleTester } = require('eslint')
const rule = require('./require-safe-browser-translation')

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

test('require-safe-browser-translation', () => {
  ruleTester.run('require-safe-browser-translation', rule, {
    valid: [
      // SafeBrowserTranslationで包まれている(&&)
      `
        const Foo = ({ loading }) => (
          <div>
            {loading && (
              <SafeBrowserTranslation>
                <Localizer id="x" defaultText="処理中" />
              </SafeBrowserTranslation>
            )}
          </div>
        )
      `,

      // SafeBrowserTranslationで包まれている(三項演算子)
      `
        const Foo = ({ loading }) => (
          <div>
            {loading ? (
              <SafeBrowserTranslation>
                <Localizer id="x" defaultText="処理中" />
              </SafeBrowserTranslation>
            ) : null}
          </div>
        )
      `,

      // 両方の分岐が対象コンポーネントのため、要素の出入りが発生しない
      `
        const Foo = ({ exceeded }) => (
          <div>
            {exceeded ? (
              <Localizer id="a" defaultText="a" />
            ) : (
              <Localizer id="b" defaultText="b" />
            )}
          </div>
        )
      `,

      // 対象コンポーネントではない要素の条件付きレンダリング
      `
        const Foo = ({ loading }) => <div>{loading && <OtherComponent />}</div>
      `,

      // 条件なしで常にレンダーされている
      `
        const Foo = () => (
          <div>
            <Localizer id="x" defaultText="処理中" />
          </div>
        )
      `,

      // &&の左辺(条件式側)にLocalizerが出てきても対象外
      `
        const Foo = ({ a }) => <div>{Boolean(a) && 'text'}</div>
      `,

      // ネストした三項演算子で、すべての分岐が対象コンポーネントのため安全
      `
        const Foo = ({ sort }) => (
          <div>
            {sort === 'asc' ? (
              <Localizer id="a" defaultText="a" />
            ) : sort === 'desc' ? (
              <Localizer id="b" defaultText="b" />
            ) : (
              <Localizer id="c" defaultText="c" />
            )}
          </div>
        )
      `,
    ],

    invalid: [
      // {cond && <Localizer />}
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading && <Localizer id="x" defaultText="処理中" />}</div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { name: 'Localizer' } }],
      },

      // {cond && <FormattedMessage />}
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading && <FormattedMessage id="x" />}</div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { name: 'FormattedMessage' } },
        ],
      },

      // {cond ? <Localizer /> : null}
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading ? <Localizer id="x" defaultText="処理中" /> : null}</div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { name: 'Localizer' } }],
      },

      // {cond ? null : <Localizer />}
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading ? null : <Localizer id="x" defaultText="処理中" />}</div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { name: 'Localizer' } }],
      },

      // 片方のみ対象コンポーネントの三項演算子(型が異なるため要素の出入りが発生する)
      {
        code: `
          const Foo = ({ loading }) => (
            <div>
              {loading ? <Localizer id="x" defaultText="処理中" /> : <OtherComponent />}
            </div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { name: 'Localizer' } }],
      },

      // ネストした三項演算子で、一部の分岐のみが対象コンポーネント
      {
        code: `
          const Foo = ({ mode, page, text }) => (
            <div>
              {mode === 'search' ? (
                <Localizer id="x" defaultText="検索結果" />
              ) : page === 'favorite' ? (
                text.favoriteModeText
              ) : (
                text.allModeText
              )}
            </div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { name: 'Localizer' } }],
      },
    ],
  })
})
