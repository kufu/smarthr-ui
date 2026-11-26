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
        const Foo = ({ loading, content }) => <div>{loading && content}</div>
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

      // additionalTextComponentRegex: 追加したコンポーネントも、要素で囲まれていれば対象外
      {
        code: `const Foo = ({ loading }) => <div>{loading && <span><Trans id="x" /></span>}</div>`,
        options: [{ additionalTextComponentRegex: ['^Trans$'] }],
      },
      // オプション未指定の場合、追加していないコンポーネント・関数は対象外
      { code: `const Foo = ({ loading }) => <div>{loading && <Trans id="x" />}</div>` },
      { code: `const Foo = ({ loading }) => <div>{loading && t('x')}</div>` },
      // Fragmentで囲まれたテキストは検知できない(既知の限界)
      { code: `const Foo = ({ loading }) => <div>{loading && <>処理中</>}</div>` },
      // translated.xxx / localized.xxx は文字列とみなすため、文字列同士の切り替えは対象外
      {
        code: `const Foo = ({ page, translated }) => <div>{page === 'favorite' ? translated.favoriteModeText : translated.allModeText}</div>`,
      },
      {
        code: `const Foo = ({ checked, localized }) => <div>{checked ? localized.checked : '無選択'}</div>`,
      },
      // translated / localized そのもの、および先頭以外に含まれる場合は対象外
      {
        code: `const Foo = ({ loading, translated, props, untranslated }) => <div>{loading && translated}{loading && props.translated.value}{loading && untranslated.value}</div>`,
      },
      // translated.xxx / localized.xxx が要素で囲まれている場合は対象外
      {
        code: `const Foo = ({ loading, translated }) => <div>{loading && <SafeBrowserTranslation>{translated.text}</SafeBrowserTranslation>}</div>`,
      },
      // name / label / text / title / message / description 系は文字列とみなすため、文字列同士の切り替えは対象外
      {
        code: `const Foo = ({ checked, label, user }) => <div>{checked ? label : '未設定'}{checked ? user.name : user.displayName}</div>`,
      },
      // name / label / text / title / message / description 系が要素で囲まれている場合は対象外
      { code: `const Foo = ({ loading, title }) => <div>{loading && <p>{title}</p>}</div>` },
      // 別の単語の末尾に含まれるだけの場合は対象外(rename, context, subtitle 等)
      {
        code: `const Foo = ({ loading, rename, context, subtitle, user }) => <div>{loading && rename}{loading && context}{loading && subtitle}{loading && user.filename}</div>`,
      },
      // JSX属性値は対象外
      {
        code: `const Foo = ({ loading, label }) => <div aria-label={loading ? label : undefined} />`,
      },
      // additionalTextVariableRegex: オプション未指定の場合、デフォルトの対象以外の変数・プロパティアクセスは対象外
      { code: `const Foo = ({ loading, caption }) => <div>{loading && caption}</div>` },
      { code: `const Foo = ({ loading, user }) => <div>{loading ? user.kana : null}</div>` },
      // additionalTextVariableRegex: マッチしない変数・プロパティアクセスは対象外
      {
        code: `const Foo = ({ loading, content, user }) => <div>{loading && content}{loading && user.age}{loading && kana}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$', '\\.kana$'] }],
      },
      // additionalTextVariableRegex: 文字列とみなすため、文字列同士の切り替えは対象外
      {
        code: `const Foo = ({ loading, caption, user }) => <div>{loading ? caption : '未設定'}{loading ? user.kana : caption}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$', '\\.kana$'] }],
      },
      // additionalTextVariableRegex: `.`つなぎで表せない式は対象外
      {
        code: `const Foo = ({ loading, users, key }) => <div>{loading && users[0].kana}{loading && getUser().kana}{loading && users[key]}</div>`,
        options: [{ additionalTextVariableRegex: ['kana$', '^users'] }],
      },
      // additionalTextVariableRegex: 要素で囲まれていれば対象外
      {
        code: `const Foo = ({ loading, caption }) => <div>{loading && <SafeBrowserTranslation>{caption}</SafeBrowserTranslation>}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$'] }],
      },
      // additionalTextVariableRegex: JSX属性値は対象外
      {
        code: `const Foo = ({ loading, caption }) => <div aria-label={loading ? caption : undefined} />`,
        options: [{ additionalTextVariableRegex: ['^caption$'] }],
      },
      // オプションに空配列を指定した場合、省略時と同じ結果になる(デフォルトの対象以外は検知されない)
      {
        code: `const Foo = ({ loading, content }) => <div>{loading && <span>text</span>}{loading && <Trans id="x" />}{loading && t('x')}{loading && content}{loading && getText()}</div>`,
        options: [
          {
            additionalTextComponentRegex: [],
            additionalTextFunctionRegex: [],
            additionalTextVariableRegex: [],
          },
        ],
      },
      // SafeBrowserTranslation以外の要素で囲まれている場合も対象外
      { code: `const Foo = ({ loading }) => <div>{loading && <p>処理中</p>}</div>` },
      {
        code: `const Foo = ({ loading }) => <div>{loading ? <Text><Localizer id="x" defaultText="処理中" /></Text> : null}</div>`,
      },
      // SafeBrowserTranslationの位置: 論理演算子の右辺・三項演算子の分岐
      `const Foo = ({ label }) => <div><Icon />{label || <SafeBrowserTranslation>未設定</SafeBrowserTranslation>}</div>`,
      `const Foo = ({ label }) => <div><Icon />{label ?? <SafeBrowserTranslation>未設定</SafeBrowserTranslation>}</div>`,
      `const Foo = ({ a, b }) => <div>{a ? <Icon /> : b ? <SafeBrowserTranslation>b</SafeBrowserTranslation> : <SafeBrowserTranslation>c</SafeBrowserTranslation>}</div>`,
      `const Foo = ({ loading }) => { const status = loading ? <SafeBrowserTranslation>処理中</SafeBrowserTranslation> : null; return <div><Icon />{status}</div> }`,
      `const Foo = ({ loading }) => <Bar suffix={loading && <SafeBrowserTranslation>処理中</SafeBrowserTranslation>} />`,
      // SafeBrowserTranslationの位置: Fragmentは要素を生成しないため、Fragment自体の位置で判定する
      `const Foo = ({ loading }) => <div>{loading && <><SafeBrowserTranslation>処理中</SafeBrowserTranslation><Icon /></>}</div>`,
      // SafeBrowserTranslationの位置: mapメソッドのコールバック関数の戻り値
      `const Foo = ({ names }) => <p>{names.map((name) => <SafeBrowserTranslation key={name}>{name}</SafeBrowserTranslation>)}</p>`,
      `const Foo = ({ names }) => <p>{names?.map((name) => { return <SafeBrowserTranslation key={name}>{name}</SafeBrowserTranslation> })}</p>`,
      `const Foo = ({ groups }) => <p>{groups.flatMap(function (group) { return <SafeBrowserTranslation key={group.id}>{group.name}</SafeBrowserTranslation> })}</p>`,
      // SafeBrowserTranslationの位置: if・switchによる条件付きのreturn
      `
        const Foo = ({ error }) => {
          if (error) return <SafeBrowserTranslation>エラー</SafeBrowserTranslation>

          return <div>content</div>
        }
      `,
      `
        const Foo = ({ status }) => {
          switch (status) {
            case 'error':
              return <SafeBrowserTranslation>エラー</SafeBrowserTranslation>
            default:
              return <div>content</div>
          }
        }
      `,
      // SafeBrowserTranslationの位置: 同じ親の中に出入りする子要素がある場合
      // (出入りする要素の挿入位置の基準となるテキストノードを保護する目的のため正当な利用)
      `const Foo = ({ icon }) => <button>{icon && <Icon />}<SafeBrowserTranslation>保存</SafeBrowserTranslation></button>`,
      `const Foo = ({ icon }) => <button>{icon ? <Icon /> : null}<SafeBrowserTranslation>保存</SafeBrowserTranslation></button>`,
      `const Foo = ({ items }) => <div>{items.map((item) => <Icon key={item} />)}<SafeBrowserTranslation>保存</SafeBrowserTranslation></div>`,
      `const Foo = ({ icon }) => <>{icon && <Icon />}<SafeBrowserTranslation>保存</SafeBrowserTranslation></>`,
      // SafeBrowserTranslation以外の要素は位置・属性のチェック対象外
      `const Foo = () => <p><span className="x">text</span></p>`,
    ],

    invalid: [
      // SafeBrowserTranslationの位置: 要素の直下(テキストは親の要素と一緒に出入りするため不要)
      {
        code: `const Foo = () => <p><SafeBrowserTranslation>処理中</SafeBrowserTranslation></p>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      {
        code: `const Foo = ({ loading }) => <div>{loading && <p><SafeBrowserTranslation>処理中</SafeBrowserTranslation></p>}</div>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      // 出入りしない兄弟のみの場合は検知される
      {
        code: `const Foo = ({ count }) => <div><Icon />{count}<SafeBrowserTranslation>件</SafeBrowserTranslation></div>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      // SafeBrowserTranslationの位置: コンポーネントが無条件で直接返している
      {
        code: `const LoadingText = () => <SafeBrowserTranslation><Localizer id="x" defaultText="処理中" /></SafeBrowserTranslation>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      {
        code: `
          const Foo = ({ error }) => {
            if (error) return <div>error</div>

            return <SafeBrowserTranslation>content</SafeBrowserTranslation>
          }
        `,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      {
        code: `const Foo = () => <><SafeBrowserTranslation>content</SafeBrowserTranslation><Icon /></>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      // SafeBrowserTranslationの位置: 関数の引数・変数・属性に直接渡している
      {
        code: `const Foo = () => { setText(<SafeBrowserTranslation key={position}>text</SafeBrowserTranslation>) }`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      {
        code: `const status = <SafeBrowserTranslation>処理中</SafeBrowserTranslation>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      {
        code: `const Foo = () => <Bar suffix={<SafeBrowserTranslation>処理中</SafeBrowserTranslation>} />`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      // SafeBrowserTranslationの位置: map以外のメソッドのコールバック関数、mapのコールバック関数内の別の関数
      {
        code: `const Foo = ({ names }) => <p>{names.forEach((name) => <SafeBrowserTranslation key={name}>{name}</SafeBrowserTranslation>)}</p>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      {
        code: `const Foo = ({ names }) => <p>{names.map((name) => { const render = () => { return <SafeBrowserTranslation>{name}</SafeBrowserTranslation> }; return render() })}</p>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationPosition' }],
      },
      // SafeBrowserTranslationの属性: key以外の属性は指定できない
      {
        code: `const Foo = ({ loading }) => <div>{loading && <SafeBrowserTranslation className="x" aria-hidden="true">処理中</SafeBrowserTranslation>}</div>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationAttribute' }],
      },
      {
        code: `const Foo = ({ loading, ...rest }) => <div>{loading && <SafeBrowserTranslation {...rest}>処理中</SafeBrowserTranslation>}</div>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationAttribute' }],
      },
      {
        code: `const Foo = ({ loading }) => <div>{loading && <SafeBrowserTranslation key="a" id="x">処理中</SafeBrowserTranslation>}</div>`,
        errors: [{ messageId: 'invalidSafeBrowserTranslationAttribute' }],
      },
      // 属性・位置の両方に問題がある場合、それぞれ検知される
      {
        code: `const Foo = () => <p><SafeBrowserTranslation className="x">処理中</SafeBrowserTranslation></p>`,
        errors: [
          { messageId: 'invalidSafeBrowserTranslationAttribute' },
          { messageId: 'invalidSafeBrowserTranslationPosition' },
        ],
      },
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
          const Foo = ({ mode, page, values }) => (
            <div>
              {mode === 'search' ? (
                <Localizer id="x" defaultText="検索結果" />
              ) : page === 'favorite' ? (
                values.favorite
              ) : (
                values.all
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

      // additionalTextComponentRegex: 追加したコンポーネントも検知される
      {
        code: `const Foo = ({ loading }) => <div>{loading && <Trans id="x" />}</div>`,
        options: [{ additionalTextComponentRegex: ['^Trans$'] }],
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Trans要素' } }],
      },
      // additionalTextComponentRegex: デフォルトのコンポーネントも引き続き検知される
      {
        code: `const Foo = ({ loading }) => <div>{loading && <Localizer id="x" defaultText="処理中" />}</div>`,
        options: [{ additionalTextComponentRegex: ['^Trans$'] }],
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } }],
      },
      // additionalTextFunctionRegex: 追加した関数の呼び出し結果も検知される
      {
        code: `const Foo = ({ loading }) => <div>{loading && t('x')}</div>`,
        options: [{ additionalTextFunctionRegex: ['^t$'] }],
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 't()の呼び出し結果' } },
        ],
      },
      // additionalTextFunctionRegex: メンバー式経由の呼び出しも検知される
      {
        code: `const Foo = ({ loading, i18n }) => <div>{loading ? i18n.t('x') : null}</div>`,
        options: [{ additionalTextFunctionRegex: ['^t$'] }],
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 't()の呼び出し結果' } },
        ],
      },
      // translated.xxx / localized.xxx はデフォルトで文字列とみなして検知される
      {
        code: `const Foo = ({ loading, translated }) => <div>{loading && translated.text}</div>`,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'translated.text' } },
        ],
      },
      {
        code: `const Foo = ({ loading, localized }) => <div>{loading ? localized?.text : null}</div>`,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'localized.text' } }],
      },
      // 要素との切り替えは検知される
      {
        code: `
          const Foo = ({ mode, page, translated }) => (
            <div>
              {mode === 'search' ? (
                <SafeBrowserTranslation>
                  <Localizer id="x" defaultText="検索結果" />
                </SafeBrowserTranslation>
              ) : page === 'favorite' ? (
                translated.favoriteModeText
              ) : (
                translated.allModeText
              )}
            </div>
          )
        `,
        errors: [
          {
            messageId: 'requireSafeBrowserTranslation',
            data: { label: 'translated.favoriteModeText' },
          },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'translated.allModeText' } },
        ],
      },
      // name / label / text / title / message / description はデフォルトで文字列とみなして検知される
      {
        code: `const Foo = ({ loading, name, label, text, title, message, description }) => <div>{loading && name}{loading && label}{loading && text}{loading && title}{loading && message}{loading && description}</div>`,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'name' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'label' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'text' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'title' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'message' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'description' } },
        ],
      },
      // xxxName のように大文字始まりで終わる名称も検知される
      {
        code: `const Foo = ({ loading, userName, errorMessage, item }) => <div>{loading && userName}{loading ? errorMessage : null}{loading && item.shortDescription}</div>`,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'userName' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'errorMessage' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'item.shortDescription' } },
        ],
      },
      // xxx.name のようなプロパティアクセスも検知される
      {
        code: `const Foo = ({ loading, user }) => <div>{loading && user.name}{loading && user?.department?.fullName}</div>`,
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'user.name' } },
          {
            messageId: 'requireSafeBrowserTranslation',
            data: { label: 'user.department.fullName' },
          },
        ],
      },
      // 要素との切り替えは検知される
      {
        code: `const Foo = ({ isNew, label }) => <button>{isNew ? <Text>新規</Text> : label}</button>`,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'label' } }],
      },
      // additionalTextVariableRegex: デフォルトの対象も引き続き検知される
      {
        code: `const Foo = ({ loading, translated }) => <div>{loading && translated.text}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$'] }],
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'translated.text' } },
        ],
      },
      // additionalTextVariableRegex: 変数名にマッチする場合、文字列とみなして検知される
      {
        code: `const Foo = ({ loading, caption }) => <div>{loading && caption}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$'] }],
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'caption' } }],
      },
      {
        code: `const Foo = ({ loading, caption }) => <div>{loading ? caption : null}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$'] }],
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'caption' } }],
      },
      // additionalTextVariableRegex: 属性名は`.`つなぎで指定できる
      {
        code: `const Foo = ({ loading, user }) => <div>{loading && user.kana}</div>`,
        options: [{ additionalTextVariableRegex: ['\\.kana$'] }],
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'user.kana' } }],
      },
      // additionalTextVariableRegex: オプショナルチェーン・non-null assertion相当・thisも`.`つなぎとして扱う
      {
        code: `const Foo = ({ loading, user }) => <div>{loading && user?.department?.kana}{loading ? this.props.kana : <Icon />}</div>`,
        options: [{ additionalTextVariableRegex: ['\\.kana$'] }],
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'user.department.kana' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'this.props.kana' } },
        ],
      },
      // additionalTextVariableRegex: 経路全体を指定することもできる
      {
        code: `const Foo = ({ loading, user, group }) => <div>{loading && user.kana}{loading && group.kana}</div>`,
        options: [{ additionalTextVariableRegex: ['^user\\.kana$'] }],
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: 'user.kana' } }],
      },
      // additionalTextVariableRegex: 要素・何もレンダーされない値との切り替えは検知される
      {
        code: `const Foo = ({ loading, caption }) => <div>{loading ? caption : <Icon />}{loading ? '' : caption}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$'] }],
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'caption' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'caption' } },
        ],
      },
      // additionalTextVariableRegex: コンポーネントとの切り替えは種類が異なるため両方検知される
      {
        code: `const Foo = ({ loading, caption }) => <div>{loading ? caption : <Localizer id="x" defaultText="処理中" />}</div>`,
        options: [{ additionalTextVariableRegex: ['^caption$'] }],
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'caption' } },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
        ],
      },
      // オプションに空配列を指定した場合、省略時と同じ結果になる(デフォルトの対象は引き続き検知される)
      {
        code: `const Foo = ({ loading, label }) => <div>{loading && <Localizer id="x" defaultText="処理中" />}{loading && localize({ id: 'x' })}{loading && label}</div>`,
        options: [
          {
            additionalTextComponentRegex: [],
            additionalTextFunctionRegex: [],
            additionalTextVariableRegex: [],
          },
        ],
        errors: [
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
          {
            messageId: 'requireSafeBrowserTranslation',
            data: { label: 'localize()の呼び出し結果' },
          },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'label' } },
        ],
      },
      // 条件分岐の外側を要素で囲んでも、テキストノード自体が出入りするため検知される
      {
        code: `const Foo = ({ loading }) => <div><Icon /><SafeBrowserTranslation>{loading && <Localizer id="x" defaultText="処理中" />}</SafeBrowserTranslation></div>`,
        errors: [
          { messageId: 'invalidSafeBrowserTranslationPosition' },
          { messageId: 'requireSafeBrowserTranslation', data: { label: 'Localizer要素' } },
        ],
      },
      {
        code: `const Foo = ({ loading }) => <div><Icon /><span>{loading ? '処理中' : null}</span></div>`,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },
      // Fragmentの直下にある場合も検知される
      {
        code: `const Foo = ({ loading }) => <>{loading && '処理中'}</>`,
        errors: [{ messageId: 'requireSafeBrowserTranslation', data: { label: '文字列リテラル' } }],
      },
    ],
  })
})
