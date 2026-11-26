# eslint-local-rules

このディレクトリのルールは、AGENTS.md に書かれたコード規約のうち機械的に検知できるものを強制します。違反するとエラーになるため、AGENTS.md 本体では詳細を繰り返さず、ここに集約しています。「なぜこの規約があるか」「どう書き換えるか」はエラーメッセージ自体に含めてあるので、違反した時点でそのメッセージを読めば対応できます。

AGENTS.md 側で各ルールがカバーしない設計判断（ルールでは検知できない「どちらが良いコードか」の基準）を解説している箇所からは、該当セクションへのリンクを置いています。

## best-practice-for-use-latest

`useLatest`（`src/hooks/useLatest.ts`）の安全な使用方法を強制します。

- 変数名は必ず `latest`。分割代入（`const { onChange } = useLatest(...)`）は禁止 — `latest` という名前自体が「他のファイルに渡せない」「同一ファイル内の全参照を機械的に集められる」という前提になっており、他のチェック（未使用プロパティ検知など）もこれに依存しています
- `useEffect`/`useLayoutEffect`/`useCallback`/`useMemo`/`useLayoutEffectRef` の外、またはそれらのコールバック内で定義されたネストした関数の外で `latest.xxx` を参照することは禁止（`noUsageOutsideHook`/`noUsageOutsideHookInFunction`）
- `latest` 自体の代入・関数への受け渡し・配列やオブジェクトへの格納は禁止（`noLatestItself`）。プロパティ経由でのみ使うことを強制します
- 依存配列には `latest` 自体のみ含められ、`latest.xxx` のようなプロパティアクセスは禁止（`noPropertyInDeps`）。`latest` を含める場合は依存配列の最後尾に置く必要があります（`latestMustBeLastInDeps`）
- スプレッド構文・`in` 演算子・`for...in`・`Object.keys`/`values`/`entries` 等での `latest` の扱いは禁止（`noSpread`/`noInOperator`/`noObjectMethods`/`noForIn`）。すべて「どのプロパティが使われたか」を静的に追跡できなくする操作のため
- `useMemo`/`useEffect`/`useLayoutEffect`/`useLayoutEffectRef` のコールバック直下で、`latest.xxx` の値を関数呼び出しを挟まず変数にそのまま代入すると、代入した瞬間の値に固定されてしまいます（`noEagerCapture`）。`useCallback` は対象外です — コールバック自体が呼ばれるたびに本体が再評価されるため、直下での代入も呼び出しごとに最新値を取り直し、この問題が構造的に起きません
  - `xxxRef.current` のような RefObject の `current` 参照は、ref 自体が不変の参照であり「読み出した時点の値」を使うのが一般的な React パターンのため例外です
- `useLatest` に渡したプロパティのうち、同一ファイル内のどこからも参照されていないものを検知します（`unusedProperty`）

## best-practice-for-functions-deps

`useLatest` + `functions` パターン（AGENTS.md の「useLatest + functions パターン」参照）で、`functions` 変数の `useMemo` 依存配列を制限します。`functions` は `latest` にさえ依存していれば再生成が必要になる可能性はほぼ無い、という前提に立ちます。

- 依存配列に含められるのは `latest`、`hasXxxx` 形式の変数（外部から受け取る関数 prop の有無を示す boolean など安定した値）、または依存配列が空の `useCallback` の戻り値のみ（`invalidDependency`）。それ以外の変数を直接含めると、不要な再生成の原因になります
- `functions` と同一スコープ（`functions` が宣言されている関数スコープそのもの。祖先スコープは辿らない）に `useCallback` が個別に宣言されている場合、依存配列の中身を問わず検知します（`noCallbackInFunctionsScope`）。これは「`functions` 自体は安定している」という前提に立てば、同スコープの個別 `useCallback` も基本的には `functions` 内に統合できるはず、という考え方に基づきます
  - 統合できない正当な理由がある場合（ref callback の detach/attach を利用した設計など）は、理由を書いた上で `eslint-disable-next-line` してください

「`hasXxxx` という名前の変数が本当に安定しているか」「依存配列をどう設計すべきか」といった、名前パターンだけでは機械的に判定できない基準は AGENTS.md の該当セクションを参照してください。

## best-practice-for-use-layout-effect-ref

`useLayoutEffectRef`（`src/hooks/client/useLayoutEffectRef.ts`）の依存配列が空の場合、より軽量な `useCallback` への変更を促します（`preferUseCallback`）。依存配列が空ということは「dependencies 変化時に再実行する」という `useLayoutEffectRef` 本来の利点を使っていないということなので、`useRef` + `useLayoutEffect` を内部で使う分のコストに見合いません。

## require-client

`'use client'` ディレクティブの要否をチェックします（AGENTS.md の「'use client' を付けるべきかの判定」参照）。

- `'use client'` を持つファイルは `client` ディレクトリ配下に置かれているか（`requireClientDirectory`）
- コンポーネントファイル（ファイル名が大文字始まり）が client 専用の API を使っているのに `'use client'` を持たない、ということがないか（`requireUseClientDirective`）。判定対象は3種類
  - `react` から import した Server Component で使えない API（`useState`/`useRef`/`useEffect`/`useLayoutEffect`/`useContext`/`useReducer`/`useSyncExternalStore`/`useImperativeHandle`/`createContext`。実際に呼び出されているかまで見ます）
  - `src/hooks/client/` 配下で定義されている hook 名（ハードコードしたリストで判定。新しい hook を追加したらこのファイルのリストも更新すること）
  - `src/intl` 配下で定義されている client 専用 hook 名

このルールが検知するのは「ファイル単体を見て機械的に判定できる」範囲のみです。`client/` 配下のディレクトリ構成の設計判断（`components/`/`hooks/` に分けるべきか、`client/index.ts` を作ってよいか）、外部パッケージが client 専用 API を安全に使っているかの調査、RSC グラフとビルド出力の実測手順などは、ルールでは検知できないため AGENTS.md 本体に記載があります。

## require-safe-browser-translation

ブラウザの自動翻訳機能によるクラッシュ対策（AGENTS.md の「ブラウザの自動翻訳機能によるクラッシュ対策」参照）として、条件によって出入りする「要素でラップされていない生のテキスト」が要素（`SafeBrowserTranslation` 等）で囲まれているかを検知します（`requireSafeBrowserTranslation`）。対象は JSX の子要素（children）位置にある式のみで、JSX属性値（`aria-current={current ? 'page' : undefined}` 等）は対象外です。

「生のテキスト」として扱うのは次の4種類です。

- `Localizer`/`FormattedMessage` 要素。smarthr-uiには「文言は多言語化する」規約（`smarthr/require-i18n-text`）があり、JSX上のテキストはほぼ必ずこれらを経由するため、コンポーネント名のみで機械的に判定できます
- 文字列リテラル・テンプレートリテラル。型レベルで明らかに文字列であることが確定しています（ただし空文字列 `''`、および補間を持たず静的に空文字列と確定しているテンプレートリテラル（` `` `）は `null`/`undefined`/`false`/`true` と同じく「何もレンダーされない」値のため「生のテキスト」としては扱いません。補間を持つ動的なテンプレートリテラルは対象のままです）
- `localize(...)`/`formatMessage(...)`（`intl.formatMessage(...)` のようなメンバー式経由も含む）の呼び出し結果。`useIntl` の `localize`（および react-intl の `formatMessage`）は戻り値が常に string 型の `Localizer` の関数版で、呼び出し式のメソッド名のみで機械的に判定できます。文字列リテラルと同じ `kind: 'string'` として扱いますが、戻り値が実行時に空文字列になりうるかは判定できないため、文字列リテラルの空文字列判定のような緩和は適用されません
- 名称から値が文字列であると推測できる変数・プロパティアクセス。プロパティアクセスは `.` つなぎの文字列に変換した上で判定します（`user?.name` は `user.name` として扱う）。`items[0].name` や `getUser().name` のように `.` つなぎで表せない式は対象外です。`localize(...)` と同じく `kind: 'string'` として扱い、空文字列判定のような緩和は適用されません
  - `translated.xxx` / `localized.xxx`（`useLocalize` 等で得た、翻訳済みの文言をまとめたオブジェクトの属性）
  - `name` / `label` / `text` / `title` / `message` / `description`、およびそれらで終わる名称（`label`、`userName`、`user.name`、`user?.department?.fullName` 等）。`rename` や `subtitle` のように別の単語の末尾に含まれているだけの場合は対象外です
  - 名称のみで判定するため、`isShowName` のように文字列ではない値や、`ReactNode` を受け取る `label` でも対象になります。要素で囲むべきでない正当な理由がある場合は、理由を書いた上で `eslint-disable-next-line` してください

上記以外の変数・関数呼び出しは、文字列である保証がないため対象外です。

検知するパターン:

- `{cond && <Localizer ... />}` / `{cond && 'text'}`（論理AND式の右辺が上記のいずれか）
- `{cond ? <Localizer ... /> : X}` / `{cond ? 'text' : X}`（三項演算子の片方のみが上記のいずれか）
- `{cond && (cond2 ? <Localizer ... /> : null)}`（論理AND式の右辺に三項演算子が続く場合も、`&&` の右辺を辿って判定するため検知対象になります）

三項演算子の両分岐が同じ種類（同じコンポーネントかつ `key` も同一、または文字列リテラル/テンプレートリテラル同士）の場合は、Reactが要素を再利用しマウント/アンマウントが発生しないため対象外です。コンポーネントの場合、タグ名が同じでも `key` 属性が異なれば（片方だけ指定されている場合、`key` の省略と `key=""` のような明示的な空文字列指定を区別した場合も含め）Reactは要素を再利用しないため対象のままです。`key` が動的な式、または `JSXSpreadAttribute`（`{...props}`）経由で静的に存在を判定できない場合も、安全側に倒して対象のまま扱います。

なお、同じコンポーネント・`key` で要素が再利用される場合もクラッシュは起きませんが、表示内容（`id` 等）が変わるなら `SafeBrowserTranslation` に内容を反映した `key` を設定する必要があります。詳細は AGENTS.md の「`useState` 等で内容が動的に変わる場合、`SafeBrowserTranslation` に `key` が必要なことがある」を参照してください（この判断はルールでは検知できません）。

ただし、文字列リテラル/テンプレートリテラルが型の確定しない変数（`number` 等も含む）と組み合わさっている場合も対象外とします。Reactの内部的には文字列・数値はどちらも同じ「テキストノード」として扱われ、実際には要素の出入りが発生せず安全なケースが多いためです（例: `count > max ? \`${max}+\` : count` は実機検証でクラッシュしないことを確認済み）。一方、`null`/`undefined`/`false`/`true`/`''`（および補間を持たず静的に空と確定しているテンプレートリテラル）との組み合わせ、および対象外のJSX要素・Fragment（`<Icon />`等）との組み合わせは、要素の有無そのものが切り替わる（またはnumber等と異なり確実に要素である）ため、この緩和の対象外です。また `Localizer` 等のコンポーネントが絡む場合は要素の型が明確に異なるため、変数との混在でも検知します。ネストした三項演算子で `null`/`undefined`/`false`/`true`/`''` が確定した分岐として混在する場合も、他の分岐が型不明の変数であっても対象のまま検知します（例: `a ? 'text' : b ? null : value` は `value` が型不明でも報告します）。

修正方法:

1. まずマークアップを見直します。意味づけ・スタイルのために要素で囲むべきテキストの場合は、適切な要素で囲みます（`span` に限らず、テキストと一緒に出入りする要素であれば検知対象から外れます）
2. 現状のマークアップが正しい場合は `SafeBrowserTranslation` で囲み、「意味づけ・スタイルのための要素ではなく、ブラウザ翻訳対策のための要素である」ことを明確にします
   - 1・2のいずれの場合も、要素は条件分岐の内側に置きます。`<span>{loading && <Localizer ... />}</span>` のように条件分岐の外側を囲んでも、テキストノード自体が出入りすることは変わらないため解決しません（このルールでも引き続き検知されます）
3. 三項演算子の全分岐を文字列に揃えられる場合（`Localizer` を `useLocalize` の戻り値に置き換える等）は、要素の出入り自体が発生しなくなるため、要素で囲む必要がなくなります

`SafeBrowserTranslation` の位置（`invalidSafeBrowserTranslationPosition`）:

`SafeBrowserTranslation` は、出入りするテキストを直接囲む位置で利用します。次のいずれにも該当しない位置にある場合は検知します。

- 論理演算子（`&&` / `||` / `??`）の右辺
- 三項演算子の分岐
- `map` / `flatMap` メソッドのコールバック関数の戻り値
- `if` / `switch` による条件付きの `return`
- 同じ親の中に、条件分岐・`map` メソッドによって出入りする子要素がある場合（後述の既知の限界にある、出入りする要素の直後にあるテキストを保護する目的での利用です）

Fragmentは要素を生成しないため、Fragment自体の位置で判定します（`{cond && <><SafeBrowserTranslation>text</SafeBrowserTranslation><Icon /></>}` は問題ありません）。

検知された場合は、次のいずれかで対応します。

- テキストが出入りしない場合、もしくは親の要素と一緒に出入りする場合は、`SafeBrowserTranslation` が不要なため削除します（例: `<p><SafeBrowserTranslation>text</SafeBrowserTranslation></p>` は、テキストが `p` と一緒に出入りするため `<p>text</p>` で問題ありません）
- 別の場所にある条件分岐・`map` メソッドによって出入りする場合は、その条件分岐・`map` メソッドの内側に移動します（例: コンポーネントが `SafeBrowserTranslation` を無条件で直接返している場合、そのコンポーネントを条件付きでレンダーしている呼び出し側で囲みます）
- `useState` 等に保持してから条件付きでレンダーする等、意図的にその位置で利用している場合は、理由を書いた上で `eslint-disable-next-line` します

`SafeBrowserTranslation` の属性（`invalidSafeBrowserTranslationAttribute`）:

`SafeBrowserTranslation` に `key` 以外の属性（スプレッドを含む）が指定されている場合は検知します。`SafeBrowserTranslation` は「意味づけ・スタイルのための要素ではなく、ブラウザ翻訳対策のための要素である」ことを明確にするためのコンポーネントのため、`className` や `aria-*` 等の属性が必要な場合は `span` などの適切な要素に置き換えます。`key` は要素を再生成させる目的で指定する場合があるため対象外です。

`SafeBrowserTranslation` の中身（`unnecessarySafeBrowserTranslation`）:

位置が正しい場合でも、中身がちょうど1つの子要素で、かつその子要素が「生のテキスト」として分類される種類（前述の4種類）のいずれにも該当しない場合（`Icon` 等、確実に要素であるコンポーネントのみを包んでいる場合）は検知します。`Icon` 等のコンポーネントが `alt` でテキストを持つ場合も、そのテキストは常に要素（`VisuallyHiddenText` 等）でラップされて提供されるため、裸のテキストノードとして出入りすることはなく、`SafeBrowserTranslation` で包む必要はありません。検知された場合は `SafeBrowserTranslation` を削除します。子要素が複数、または0件の場合は判定できないため、安全側に倒して対象外とします。

オプション（いずれも正規表現文字列の配列。デフォルトの対象に追加されます）:

- `additionalTextComponentRegex`: `Localizer`/`FormattedMessage` 以外に、実体としてテキストノードしか生成しないコンポーネントの名称
- `additionalTextFunctionRegex`: `localize`/`formatMessage` 以外に、戻り値が常に文字列になる関数の名称（メンバー式経由の呼び出しはプロパティ名で判定）
- `additionalTextVariableRegex`: デフォルトの対象以外に、値が文字列であることが分かっている変数・プロパティアクセスの名称（例: `'^caption$'`、`'\\.kana$'`）

このルールは `eslint-plugin-smarthr` の `smarthr/require-safe-browser-translation` と判定ロジックを揃えています。変更する場合は両方に反映してください。

**このルールが検知できない既知の限界**:

- `useState` 等の変数に一度代入してから条件付きでレンダーするパターン（例: `setLiveRegionText(<Localizer ... />)` と `setLiveRegionText('')` の組み合わせ）。構文解析だけでは変数の値の出入りを追跡できないため検知できません
- 型不明の変数（`number` 等）が実行時に `null`/`undefined`/`false` になりうる場合（例: `{cond ? 'text' : value}` で `value` が `null` を返しうる場合）。型情報のない構文解析では変数が実行時にどんな値になりうるか判定できません
- 出入りする要素の直後にある、常に表示されるテキスト（例: `<button>{icon && <Icon />}保存</button>`）。Reactは要素を挿入する際、直後のノードを挿入位置の基準にします。基準となるテキストノードがブラウザ翻訳によって置き換えられていると `insertBefore` でクラッシュします。この場合は、常に表示されるテキスト側を囲みます（`<button>{icon && <Icon />}<SafeBrowserTranslation>保存</SafeBrowserTranslation></button>`）

該当しそうな箇所は AGENTS.md の判断基準に沿ってレビューで見つける必要があります。
