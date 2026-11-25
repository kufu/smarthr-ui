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

      // 空文字列は「何もレンダーされない」値のため、&&の右辺でも対象外
      `
        const Foo = ({ checked }) => <div>{checked && ''}</div>
      `,

      // 両分岐が空文字列同士の組み合わせも対象外
      `
        const Foo = ({ checked }) => <div>{checked ? '' : ''}</div>
      `,

      // keyを両方省略した場合は対象外(現状維持の確認)
      `
        const Foo = ({ exceeded }) => (
          <div>
            {exceeded ? <Localizer id="a" defaultText="a" /> : <Localizer id="b" defaultText="b" />}
          </div>
        )
      `,

      // localize()の呼び出し結果がSafeBrowserTranslationで包まれている
      `
        const Foo = ({ loading }) => {
          const { localize } = useIntl()
          return (
            <div>
              {loading && (
                <SafeBrowserTranslation>
                  {localize({ id: 'x', defaultText: '処理中' })}
                </SafeBrowserTranslation>
              )}
            </div>
          )
        }
      `,

      // 対象外のメソッド名の呼び出しは文字列である保証がないため対象外
      `
        const Foo = ({ loading, getText }) => <div>{loading && getText()}</div>
      `,

      // 両分岐が静的に空と確定しているテンプレートリテラル同士の組み合わせは対象外
      `
        const Foo = ({ checked }) => <div>{checked ? \`\` : \`\`}</div>
      `,

      // 空文字列とtrueはどちらも「何もレンダーされない」ことが確定しているため、
      // 両分岐とも未分類(targetEntriesが空)となり対象外
      `
        const Foo = ({ checked }) => <div>{checked ? '' : true}</div>
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

      // 文字列リテラルと空文字列の組み合わせ(空文字列は「何もレンダーされない」値のため
      // 要素の有無そのものが切り替わり危険)
      {
        code: `
          const Foo = ({ loading }) => <div>{loading ? '処理中' : ''}</div>
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },

      // ネストした三項演算子で、未分類の分岐(型不明な変数)と確定した空の分岐(null)が
      // 混在する場合。typeof valueが不明でも、nullとの切り替えで要素の有無が
      // 切り替わることは確定しているため報告する
      {
        code: `
          const Foo = ({ a, b, value }) => (
            <div>{a ? 'text' : b ? null : value}</div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },

      // JSXSpreadAttribute経由でkeyが渡されている場合、静的に値を判定できないため
      // 安全側に倒して動的なkeyと同様に扱う
      {
        code: `
          const Foo = ({ exceeded }) => (
            <div>
              {exceeded ? (
                <Localizer {...{ key: 'a' }} id="a" defaultText="a" />
              ) : (
                <Localizer {...{ key: 'b' }} id="b" defaultText="b" />
              )}
            </div>
          )
        `,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
        ],
      },

      // keyの省略(present: false)と`key=""`のような明示的な空文字列指定は、
      // Reactでは前者がnull・後者が''であり異なる値のため、Reactは要素を再利用しない
      {
        code: `
          const Foo = ({ exceeded }) => (
            <div>
              {exceeded ? (
                <Localizer key="" id="a" defaultText="a" />
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

      // {cond && localize(...)}
      {
        code: `
          const Foo = ({ loading }) => {
            const { localize } = useIntl()
            return <div>{loading && localize({ id: 'x', defaultText: '処理中' })}</div>
          }
        `,
        errors: [
          {
            messageId: 'requireSafeBrowserTranslation',
            data: { label: 'localize()の呼び出し結果' },
          },
        ],
      },

      // {cond ? formatMessage(...) : null}(intl.formatMessage(...)のようなメンバー式経由)
      {
        code: `
          const Foo = ({ loading, intl }) => (
            <div>{loading ? intl.formatMessage({ id: 'x' }) : null}</div>
          )
        `,
        errors: [
          {
            messageId: 'requireSafeBrowserTranslation',
            data: { label: 'formatMessage()の呼び出し結果' },
          },
        ],
      },

      // 補間のない空のテンプレートリテラル(``)は空文字列と同じく「何もレンダーされない」値
      {
        code: `
          const Foo = ({ loading }) => <div>{loading ? '処理中' : \`\`}</div>
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },

      // trueもnull/false同様「何もレンダーされない」ことが確定している
      {
        code: `
          const Foo = ({ checked }) => <div>{checked ? '選択済み' : true}</div>
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },

      // 論理AND式の右辺に三項演算子が続く場合も、&&の右辺を辿って判定するため検知する
      {
        code: `
          const Foo = ({ visible, loading }) => (
            <div>{visible && (loading ? <Localizer id="x" defaultText="処理中" /> : null)}</div>
          )
        `,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } }],
      },
    ],
  })
})
