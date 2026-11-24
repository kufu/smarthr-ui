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

ブラウザの自動翻訳機能によるクラッシュ対策（AGENTS.md の「ブラウザの自動翻訳機能によるクラッシュ対策」参照）として、条件によって出入りする「要素でラップされていない生のテキスト」が `SafeBrowserTranslation` で包まれているかを検知します（`requireSafeBrowserTranslation`）。対象は JSX の子要素（children）位置にある式のみで、JSX属性値（`aria-current={current ? 'page' : undefined}` 等）は対象外です。

「生のテキスト」として扱うのは次の2種類です。

- `Localizer`/`FormattedMessage` 要素。smarthr-uiには「文言は多言語化する」規約（`smarthr/require-i18n-text`）があり、JSX上のテキストはほぼ必ずこれらを経由するため、コンポーネント名のみで機械的に判定できます
- 文字列リテラル・テンプレートリテラル。型レベルで明らかに文字列であることが確定しています

検知するパターン:

- `{cond && <Localizer ... />}` / `{cond && 'text'}`（論理AND式の右辺が上記のいずれか）
- `{cond ? <Localizer ... /> : X}` / `{cond ? 'text' : X}`（三項演算子の片方のみが上記のいずれか）

三項演算子の両分岐が同じ種類（同じコンポーネントかつ `key` も同一、または文字列リテラル/テンプレートリテラル同士）の場合は、Reactが要素を再利用しマウント/アンマウントが発生しないため対象外です。コンポーネントの場合、タグ名が同じでも `key` 属性が異なれば（片方だけ指定されている場合も含め）Reactは要素を再利用しないため対象のままです。`key` が動的な式で静的に比較できない場合も、安全側に倒して対象のまま扱います。

ただし、文字列リテラル/テンプレートリテラルが型の確定しない変数（`number` 等も含む）と組み合わさっている場合も対象外とします。Reactの内部的には文字列・数値はどちらも同じ「テキストノード」として扱われ、実際には要素の出入りが発生せず安全なケースが多いためです（例: `count > max ? \`${max}+\` : count` は実機検証でクラッシュしないことを確認済み）。一方、`null`/`undefined`/`false` との組み合わせは「何もレンダーされない」ことが確定しており要素の有無そのものが切り替わるため、この緩和の対象外です。また `Localizer` 等のコンポーネントが絡む場合は要素の型が明確に異なるため、変数との混在でも検知します。

**このルールが検知できない既知の限界**: `useState` 等の変数に一度代入してから条件付きでレンダーするパターン（例: `setLiveRegionText(<Localizer ... />)` と `setLiveRegionText('')` の組み合わせ）は、構文解析だけでは変数の値の出入りを追跡できないため検知できません。該当しそうな箇所は AGENTS.md の判断基準に沿ってレビューで見つける必要があります。
