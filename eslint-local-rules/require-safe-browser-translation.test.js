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

      // SafeBrowserTranslationで包まれている(文字列リテラル)
      `
        const Foo = ({ loading }) => (
          <div>{loading && <SafeBrowserTranslation>text</SafeBrowserTranslation>}</div>
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

      // 両方の分岐でkeyが同じ(静的な文字列)ため安全
      `
        const Foo = ({ exceeded }) => (
          <div>
            {exceeded ? (
              <Localizer key="same" id="a" defaultText="a" />
            ) : (
              <Localizer key="same" id="b" defaultText="b" />
            )}
          </div>
        )
      `,

      // 両方の分岐が文字列リテラルのため安全
      `
        const Foo = ({ checked }) => <div>{checked ? '選択済み' : '無選択'}</div>
      `,

      // 文字列リテラルとテンプレートリテラルの組み合わせは、どちらも最終的に
      // 文字列としてレンダーされるため安全
      `
        const Foo = ({ checked, name }) => (
          <div>{checked ? \`\${name}を選択済み\` : '無選択'}</div>
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

      // &&の左辺(条件式側)に対象外の要素が出てきても問題ない
      `
        const Foo = ({ a }) => <div>{Boolean(a) && <OtherComponent />}</div>
      `,

      // 変数・関数呼び出しは型が静的に確定しないため対象外
      `
        const Foo = ({ loading, text }) => <div>{loading && text}</div>
      `,

      // JSX属性値はHTML属性でテキストノードを生成しないため対象外(&&)
      `
        const Foo = ({ loading }) => <div aria-label={loading && '処理中'} />
      `,

      // JSX属性値はHTML属性でテキストノードを生成しないため対象外(三項演算子)
      `
        const Foo = ({ current }) => <a aria-current={current ? 'page' : undefined} />
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

      // テンプレートリテラルと型の確定しない変数(number等)の組み合わせは、
      // Reactの内部的にはどちらも同じテキストノードとして扱われ安全
      `
        const Foo = ({ count, max }) => (
          <div>{count > max ? \`\${max}+\` : count}</div>
        )
      `,

      // 文字列リテラルと変数の組み合わせも同様に安全
      `
        const Foo = ({ checked, label }) => <div>{checked ? '選択済み' : label}</div>
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
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } }],
      },

      // {cond && <FormattedMessage />}
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading && <FormattedMessage id="x" />}</div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'FormattedMessage要素' } },
        ],
      },

      // {cond ? <Localizer /> : null}
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading ? <Localizer id="x" defaultText="処理中" /> : null}</div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } }],
      },

      // {cond ? null : <Localizer />}
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading ? null : <Localizer id="x" defaultText="処理中" />}</div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } }],
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
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } }],
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
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } }],
      },

      // 同じコンポーネントでもkeyが異なる場合、Reactは要素を再利用しない
      {
        code: `
          const Foo = ({ exceeded }) => (
            <div>
              {exceeded ? (
                <Localizer key="a" id="a" defaultText="a" />
              ) : (
                <Localizer key="b" id="b" defaultText="b" />
              )}
            </div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
        ],
      },

      // 片方のみkeyがある場合も、Reactは要素を再利用しない
      {
        code: `
          const Foo = ({ exceeded }) => (
            <div>
              {exceeded ? (
                <Localizer key="a" id="a" defaultText="a" />
              ) : (
                <Localizer id="b" defaultText="b" />
              )}
            </div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
        ],
      },

      // keyが動的な式の場合、静的に同一とは判断できないため安全とみなさない
      {
        code: `
          const Foo = ({ exceeded, dynamicKey }) => (
            <div>
              {exceeded ? (
                <Localizer key={dynamicKey} id="a" defaultText="a" />
              ) : (
                <Localizer key={dynamicKey} id="b" defaultText="b" />
              )}
            </div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
        ],
      },

      // LocalizerとFormattedMessageの混在は、keyが無くても要素の型自体が異なるため、
      // Reactは要素を再利用しない
      {
        code: `
          const Foo = ({ exceeded }) => (
            <div>
              {exceeded ? (
                <Localizer id="a" defaultText="a" />
              ) : (
                <FormattedMessage id="b" />
              )}
            </div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'FormattedMessage要素' } },
        ],
      },

      // {cond && '文字列リテラル'}
      {
        code: `
          const Foo = ({ checked }) => <div>{checked && '選択済み'}</div>
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },

      // {cond && \`テンプレートリテラル\`}
      {
        code: `
          const Foo = ({ checked, name }) => <div>{checked && \`\${name}を選択済み\`}</div>
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'テンプレートリテラル' } },
        ],
      },

      // {cond ? '文字列リテラル' : null}
      {
        code: `
          const Foo = ({ checked }) => <div>{checked ? '選択済み' : null}</div>
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },

      // コンポーネントと文字列リテラルの混在(型が異なるため要素の出入りが発生する。
      // 両方の分岐が危険な式のため、両方に報告される)
      {
        code: `
          const Foo = ({ loading }) => (
            <div>{loading ? <Localizer id="x" defaultText="処理中" /> : '処理中'}</div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } },
        ],
      },

      // 文字列リテラルと対象外コンポーネント(Icon等)の組み合わせ。number等の
      // 型不明な変数と違い、JSX要素は確実に要素であり、切り替えで要素の出入りが
      // 発生するため緩和の対象外(文字列リテラル側は報告される)
      {
        code: `
          const Foo = ({ checked }) => <div>{checked ? '選択済み' : <Icon />}</div>
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },
    ],
  })
})
