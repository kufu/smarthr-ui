# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイドです。

## プロジェクト概要

SmartHR UI は、SmartHR の全アプリケーションで使用される React コンポーネントライブラリです。pnpm モノレポ構成で、2つのパッケージがあります：
- **`packages/smarthr-ui`** — メインの UI コンポーネントライブラリ（npm に `smarthr-ui` として公開）
- **`packages/charts`** — チャートコンポーネント（npm に `@smarthr/smarthr-ui-charts` として公開）

## よく使うコマンド

各パッケージへのコマンドはルートのショートカット `pnpm ui`（smarthr-ui）または `pnpm charts`（charts）で実行します：

```sh
# セットアップ
pnpm install

# smarthr-ui の Storybook 起動（ポート 6006）
pnpm ui dev

# charts の Storybook 起動（ポート 6007）
pnpm charts dev

# 全テスト実行（ウォッチモード）
pnpm ui test

# 単一テストファイルの実行
pnpm ui test -- --run src/components/Button/Button.test.tsx

# パターンに一致するテストの実行
pnpm ui test -- --run -t "Button"

# Lint（eslint, prettier, stylelint, tsc を並列実行）
pnpm ui lint

# フォーマット（自動修正）
pnpm ui format

# ビルド
pnpm ui build

# Storybook ストーリーの雛形生成
pnpm ui scaffold:storybook
```

## アーキテクチャ

### スタイリング: Tailwind CSS + tailwind-variants
コンポーネントは **Tailwind CSS v3** と **tailwind-variants (`tv`)** を使用してバリアントベースのスタイリングを行います。Tailwind プリセットは `packages/smarthr-ui/src/smarthr-ui-preset.ts` に定義されており、カスタムデザイントークン（色、スペーシング、フォントサイズ、シャドウ、z-index、幅）を含みます。コンポーネントは `tv()` でクラス名を生成します（CSS-in-JS ではありません）。

利用者はスタイル適用のために `smarthr-ui/smarthr-ui.css` をインポートする必要があります。styled-components はまだ peer dependency ですが、Tailwind への移行が進んでいます。

### コンポーネント構成
各コンポーネントは `packages/smarthr-ui/src/components/<ComponentName>/` に配置され、以下のファイルで構成されます：
- `ComponentName.tsx` — 実装（`forwardRef`、`memo`、`tv()` を使用）
- `ComponentName.test.tsx` — Vitest + Testing Library テスト
- `stories/` — Storybook ストーリー（`*.stories.tsx`）と VRT ストーリー（`VRT*.stories.tsx`）
- `index.ts` — バレルエクスポート

すべての公開コンポーネントは `packages/smarthr-ui/src/index.ts` から再エクスポートされます。

### 国際化（i18n）
コンポーネントは `src/intl/` のカスタム i18n システムを使用します。ユーザー向けテキストは `<Localizer>` または `useIntl()` でラップします。ロケールファイルは `src/intl/locales/` にあります。`react-intl` は peer dependency です。

### テーマ
デザイントークンは `src/themes/` に定義され、`createTheme()` で公開されます。`ThemeProvider`（styled-components）と Tailwind プリセットの両方がこれらのトークンを使用します。

### テスト
- **フレームワーク**: Vitest（jsdom 環境）
- **ライブラリ**: @testing-library/react, @testing-library/user-event, @testing-library/jest-dom
- **ビジュアルリグレッション**: Chromatic（VRT ストーリーは `VRT` プレフィックス付き）

## コード規約

### 命名規則

#### イベントハンドラー
- **外部公開コンポーネントが属性として受け取る** → `onXxx` 形式
- **内部で定義するハンドラ** → `handleXxx` 形式
- **内部コンポーネントが受け取る** → `handleXxx` 形式
- **透過的に渡す場合** → `onXxx` 形式のまま保つ（リネームしない）

**判断基準**: 外部公開コンポーネントとは、`packages/smarthr-ui/src/index.ts` からexportされているコンポーネント

```tsx
// ✅ 外部公開コンポーネント（packages/smarthr-ui/src/index.tsからexportされている）
export const Button: FC<{ onClick?: () => void }> = ({ onClick }) => {
  const handleClick = () => {
    // 内部処理
    onClick?.()
  }
  return <InternalButton handleClick={handleClick} />
}

// ✅ 内部コンポーネント（packages/smarthr-ui/src/index.tsからexportされていない）
const InternalButton: FC<{ handleClick?: () => void }> = ({ handleClick }) => {
  return <button onClick={handleClick}>Click</button>
}

// ✅ 透過的に渡す場合（何も処理を加えずそのまま渡す）
export const Wrapper: FC<{ onClick?: () => void }> = ({ onClick }) => {
  // onClickをそのまま渡す場合は名称を変えない
  return <InternalComponent onClick={onClick} />
}
```

### TypeScript
- `interface` ではなく `type` を使用（ESLint ルール `@typescript-eslint/consistent-type-definitions` で強制）

### インポート
- 型インポートの形式は2つのESLintルールの組み合わせで決まる。**どちらも自動修正されるため、手で書き分ける必要はない**
  - `@typescript-eslint/consistent-type-imports`（`fixStyle: 'inline-type-imports'`）: 型を値と同じimport文にまとめ、`type` 修飾子を付ける
  - `@typescript-eslint/no-import-type-side-effects`: import文の指定子が**すべて型**の場合、`import type { ... }` 形式に変換する

  ```typescript
  // ✅ 値と型が混在する場合はインライン形式
  import { type FC, useState } from 'react'

  // ✅ すべて型の場合は import type 形式
  // （`import { type ComponentProps, type ReactNode }` と書いても自動でこの形に修正される）
  import type { ComponentProps, ReactNode } from 'react'
  ```

  **注意**: 「すべて型なのに `import type` になっている」のはルール違反ではなく、ルールが要求する正しい形。
  インライン形式へ直すよう指摘された場合は誤りなので従わない。
- ワイルドカードの禁止: `export *`、`export * as`、`import * as` は禁止（Icons のみ例外）

### アクセシビリティ
- 厳格な jsx-a11y ルールを適用
- `smarthr/a11y-*` カスタム ESLint ルールが有効

### コンポーネント
- クライアントコンポーネントには `'use client'` ディレクティブを付与
- コンポーネントサイズ: 大文字のサイズ値を使用（例: `'S'`、`'M'`、`'L'`）

### コンポーネントのブラックボックス原則

他のコンポーネントを使用する際は、そのコンポーネントの**公開インターフェース（props）のみ**を知っている前提でコードを書きます。内部実装（DOM構造・CSS実装の詳細など）を前提としたコードは可能な限り書きません。

```tsx
// ❌ ClusterがdisplayなどのCSSでどう実装されているかを前提にした外部からのスタイル
const Foo = () => (
  <Cluster className="shr-items-center" />
)

// ✅ Clusterのpropsを使って意図を伝える
const Foo = () => (
  <Cluster align="center" />
)
```

**理由:** smarthr-ui は不特定多数が更新するパブリックなモジュールであり、実装の詳細をカプセル化することで、あるコンポーネントの内部変更が他のコンポーネントに影響しない状態を保ち、開発しやすくする。

**例外: 同ディレクトリ内のローカルコンポーネント**

`src/index.ts` からexportされていないローカルコンポーネントは、同じディレクトリ内の他のファイルからその内部仕様を知っていても構いません。

例えば `Combobox/ItemButton.tsx` は外部にexportされていませんが、`Combobox/useListbox.tsx` はその props インターフェースや DOM 構造を前提としたコードを書いて良いです。

```tsx
// ✅ 同ディレクトリのローカルコンポーネントの仕様を知っている前提でOK
// useListbox.tsx が ItemButton の id 属性でオプションを特定する
return latest.options.find((o) => o.id === el.id) ?? null
```

この例外が成立する理由は、ローカルコンポーネントとその利用者が同じスコープ（ディレクトリ）内で管理されており、内部変更の影響範囲が同ディレクトリに限定されるためです。

### カスタムフックの切り出し

1つのファイルからしか利用されていないcustom hookは作成せず、利用元のコンポーネントに直接実装します。

```tsx
// ❌ SortDropdown.tsxからしか使われていないのに別ファイルに切り出す
// useSortDropdown.ts
export const useSortDropdown = (props: Props) => {
  // ...
  return { selectedLabel, checkedOrder, functions }
}

// SortDropdown.tsx
export const SortDropdown: FC<Props> = (props) => {
  const { selectedLabel, checkedOrder, functions } = useSortDropdown(props)
  // ...
}

// ✅ 利用元のコンポーネントに直接実装する
// SortDropdown.tsx
export const SortDropdown: FC<Props> = (props) => {
  const [selectedLabel, setSelectedLabel] = useState(...)
  const [checkedOrder, setCheckedOrder] = useState(...)
  const functions = useMemo(() => ({ ... }), [...])
  // ...
}
```

**理由:**
- ファイルを分割しても再利用性が生まれるわけではなく、ロジックが追いにくくなるだけの分割損になる
- 複数のコンポーネントから利用される見込みが立った時点で切り出せば十分
- フックに切り出すと、コンポーネント側からはフックの戻り値（`state`・`functions` など）しか参照できなくなるため、本来 `useMemo`/`useCallback`/`useEffect` の依存配列に含めなくても良いはずの値（`useRef` の `ref` オブジェクトなど、同一コンポーネント内であれば参照の安定性が明らかな値）まで、フックの戻り値経由になることで依存配列に含めざるを得なくなる場合がある

**例外1:** 複数のコンポーネント・ファイルから実際に利用されているカスタムフック（例: `useLatest`, `useMergeRefs`, `useOnce` など `src/hooks/` 配下の汎用フック）はこの限りではありません。

**例外2:** 同ディレクトリ内の複数コンポーネントから利用されるカスタムフックも対象外です。例えば `Disclosure/useDisclosure.ts` は `DisclosureContent.tsx` と `DisclosureTrigger.tsx` の両方から利用されているため、切り出しが妥当です。

**テストについて:** ロジックにテストが必要な場合、フック単体をテストするのではなく、まず利用元のコンポーネント経由でテストできないか検討します。コンポーネント経由のテストは実際の利用形態（DOM操作やユーザー操作）に近く、フック単体のテストより実体に即した検証ができます。

### コミット
- Conventional Commits 形式。commitlint (`@commitlint/config-conventional`) で検証される
  - type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`, `perf`, `style`, `build`, `revert`
  - scope: 任意。コンポーネント名を入れる（例: `fix(DropZone):`, `feat(StepFormDialog)!:`）
  - `!` 付きで破壊的変更を示す（例: `refactor!:`, `refactor(InformationPanel)!:`）
  - subject は日本語で記述（`subject-case` ルールは無効化されている）
  - リリースは release-please で管理。`feat` → minor、`fix` → patch、`!` → major

### スタイリング

#### classNamesの定数化
tailwind-variants (`tv()`) で生成したクラス名は、引数や依存配列が空の場合は`useMemo`ではなく定数として定義します：

```typescript
// ✅ 引数なし・依存配列なしの場合は定数化
const CLASS_NAMES = (() => {
  const { trigger, contentBody, contentButton } = classNameGenerator()

  return {
    trigger: trigger(),
    contentBody: contentBody(),
    contentButton: contentButton(),
  }
})()

// ❌ 不要なuseMemo
const classNames = useMemo(() => {
  const { trigger, contentBody, contentButton } = classNameGenerator()

  return {
    trigger: trigger(),
    contentBody: contentBody(),
    contentButton: contentButton(),
  }
}, [])  // 空の依存配列
```

**命名規則:**
- **メインのコンポーネント**: `CLASS_NAMES`
- **サブコンポーネントやヘルパー関数内**: `XXX_CLASS_NAMES`（例: `ITEM_CLASS_NAMES`, `HEADER_CLASS_NAMES`）

複数の定数化されたclassNamesが同一ファイル内に存在する場合、衝突を避けるため接頭辞を付けて区別します。

**理由:**
- 引数・依存配列がない場合、`useMemo`のオーバーヘッドが無駄
- 即時関数（IIFE）で中間変数をスコープから隔離
- `const`で再代入を防止

#### classNamesのuseMemo依存配列の最適化

`classNames` の `useMemo` には、ユーザー提供の `className` などの**安定した値のみ**を依存配列に含めます。state・props を問わずユーザー操作で変化し得る値は、CSS属性セレクタを使ってスタイルを表現し、依存配列から除外します。

```typescript
// ❌ 頻繁に変化する isExpanded・disabled を依存配列に含める
const classNames = useMemo(() => ({
  wrapper: wrapper({ focused: isExpanded, disabled, className }),
  inputWrapper: inputWrapper({ hidden: !isExpanded }),
}), [isExpanded, disabled, className])

// ✅ CSS属性セレクタで表現し、依存配列から除外
// classNameGenerator の base に記述:
//   'has-[[role=combobox][aria-expanded=true]]:shr-focus-indicator'
//   'has-[[role=combobox]:disabled]:shr-cursor-not-allowed'
const classNames = useMemo(() => ({
  wrapper: wrapper({ className }),
}), [className])
```

**判断基準:**
- **依存配列から除外する（CSS属性セレクタで表現）**: state・props を問わず、ユーザー操作で変化し得る値
  - `isExpanded`（open/close のたびに変化）
  - `disabled`（フォーム上の操作で入力可否が切り替わる場合など）
- **依存配列に含める**: ユーザー提供の `className`（任意の値が入るためセレクタ化できない）、`size`（実用上、一度表示されたコンポーネントのサイズがユーザー操作で変わる可能性はかなり低い）

**CSS属性セレクタの選び方:**
- 対象要素に既存のARIA属性がある場合 → `:has([aria-expanded=true])` など
- 対象要素に `disabled` 属性がある場合 → `:has([role=combobox]:disabled)` など
- 要素自身に属性を追加できる場合 → `data-[disabled]:` など（Chip・Checkboxパターン）

**理由:**
- `classNameGenerator()` の再実行コストを削減
- Reactの再レンダリング時にclassNames全体の再計算が不要になる

### パフォーマンス最適化パターン

#### unstableな値のmemo化

コンポーネントに渡すオブジェクト・配列は、そのコンポーネントが `memo` 化されているかどうかに関わらず、可能な限りメモ化して安定化します。コンポーネントの内部実装（`memo` 化の有無）は知らない前提でコードを書くためです。

毎レンダリングで新しい参照が生成されると、受け取ったコンポーネントが `React.memo` でラップされている場合に最適化が無効化され、不要な再レンダリングが発生します。

ただし **ネイティブHTML要素**（`div`, `span`, `input` など）に渡す場合は除きます。ネイティブ要素は `memo` 化されていないことが確定しているため、参照の安定化は不要です。

```tsx
// ❌ インラインオブジェクト・配列を渡すとReact.memoが無効化される可能性がある
const Foo = ({ color }: { color: string }) => (
  <SomeComponent style={{ color }} />
)

// ✅ useMemoで安定化する
const Foo = ({ color }: { color: string }) => {
  const style = useMemo(() => ({ color }), [color])
  return <SomeComponent style={style} />
}

// ✅ ネイティブHTML要素への場合はmemo化不要
const Foo = ({ color }: { color: string }) => (
  <div style={{ color }} />
)
```

**例外: `Layout` ディレクトリ以下のコンポーネント**

`src/components/Layout/` 以下のコンポーネント（`Stack`, `Cluster` など）はレイアウト用の薄いラッパーという特性上、今後も `React.memo` 化される見込みが皆無です。そのため、これらのコンポーネントに渡す `style` などのオブジェクト・配列をメモ化する必要はありません。

```tsx
// ✅ StackはLayout配下でmemo化されないため、styleのメモ化は不要
const Foo = ({ maxColumns }: { maxColumns?: number }) => (
  <Stack style={{ flexBasis: maxColumns ? `calc(100% / ${maxColumns})` : undefined }} />
)
```

#### useLatest + functions パターン
複数のイベントハンドラーやコールバックを安定化する際は、`useLatest` フックと `useMemo` で統合した `functions` オブジェクトを使用します。

**基本構造:**
```typescript
const latest = useLatest({ onChange, onSubmit, parseInput })

const functions = useMemo(
  () => ({
    handleChange: (e) => {
      // latest.onChange を使用
      latest.onChange?.(e)
    },
    handleSubmit: (e) => {
      // latest.onSubmit を使用
      latest.onSubmit?.(e)
    },
  }),
  [latest],
)
```

**外部関数のboolean化パターン:**
外部公開コンポーネントが受け取る関数propsは、利用者側でmemo化されていない可能性が高いため、boolean化して安定化します：

```typescript
// ❌ 外部から受け取る関数を直接依存配列に入れると、再レンダリング毎に再計算される
const functions = useMemo(() => ({ ... }), [onClick, hrefTemplate, latest])

// ✅ boolean化してプリミティブ値として安定化
const hasHrefTemplate = !!hrefTemplate
const functions = useMemo(
  () => ({
    actualHrefTemplate: hasHrefTemplate
      ? (pageNumber: number) => latest.hrefTemplate!(pageNumber)
      : undefined,
    handleClick: (e) => {
      if (latest.hrefTemplate) {
        // hrefTemplateが存在する場合の処理
      } else {
        // 存在しない場合の処理
      }
    },
  }),
  [hasHrefTemplate, latest],
)
```

**boolean化の判断基準:**
- **boolean化が必要**: 外部公開コンポーネント（`src/index.ts`からexport）が受け取る関数props
  - `onClick`, `onChange`, `hrefTemplate`, `onSelectDate` など
  - 利用者側でmemo化されていない可能性が高い
- **boolean化が不要**: 内部で生成された関数
  - `functions.handleClick`, 内部`useCallback`の結果など
  - 既にmemo化されている想定

**理由**: 関数が「設定される場合は設定され続ける」「設定されない場合は設定されない状態が続く」という実用上の特性があるため、存在有無（boolean）は安定しているが、関数参照は不安定。boolean化により不要な再計算を防ぐ。

**共通処理の切り出しパターン:**
useMemo内で複数のハンドラーが共通の処理を使う場合、その処理を別関数として切り出します。切り出した関数は他のハンドラー内で使用でき、必要に応じてfunctionsオブジェクトのプロパティとしても返すことができます：

```typescript
const functions = useMemo(() => {
  // 共通処理を切り出し
  const dateToString = (date: Date | null) =>
    latest.formatDate ? latest.formatDate(date) : DEFAULT_DATE_TO_STRING(date)

  const stringToDate = (str?: string | null) => {
    if (!str) return null
    return latest.parseInput ? latest.parseInput(str) : parseJpnDateString(str)
  }

  const updateDate = (e: ChangeLikeEvent, newDate: Date | null) => {
    // dateToString を使用
    const formatValue = dateToString(newDate)
    // ... 複雑な処理
  }

  return {
    // 切り出した関数を外部でも使えるよう返す
    dateToString,
    stringToDate,
    // イベントハンドラーは切り出した関数を使用
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      const newDate = stringToDate(e.target.value)
      updateDate(e, newDate)
    },
    handleSubmit: (e: React.FormEvent) => {
      const newDate = stringToDate(e.currentTarget.value)
      updateDate(e, newDate)
    },
  }
}, [latest])

// 外部での使用例
useEffect(() => {
  const newDate = functions.stringToDate(value)
  if (newDate) {
    inputRef.current.value = functions.dateToString(newDate)
  }
}, [value, functions])
```

このパターンにより、共通処理の重複を避け、コードの保守性を向上させます。

**重要な注意点 - 不要な関数を返さない:**
元々のコードで他のuseCallbackの依存配列に含めるためだけに作られていた中間的なuseCallbackは、functionsオブジェクトに含めないでください：

```typescript
// ❌ 元のパターン
const helperFunction = useCallback(() => {
  // 何らかの処理
}, [deps])

const mainHandler = useCallback(() => {
  helperFunction()  // helperFunctionを使用
}, [helperFunction])  // 依存配列のためだけにuseCallback化

// ✅ functionsパターンに変換（不要な関数は返さない）
const functions = useMemo(() => {
  // 内部でのみ使う関数は返さない
  const helperFunction = () => {
    // 何らかの処理
  }

  return {
    // helperFunctionは外部で使われないので含めない
    mainHandler: () => {
      helperFunction()  // 内部で使用するだけ
    },
  }
}, [deps])

// ✅ 外部でも使う場合のみ含める
const functions = useMemo(() => {
  const helperFunction = () => {
    // 何らかの処理
  }

  return {
    helperFunction,  // useEffect等で外部から使う場合は含める
    mainHandler: () => {
      helperFunction()
    },
  }
}, [deps])
```

最終的なfunctionsオブジェクトには、JSX内で使用する関数や、useEffect等で外部から参照する関数のみを含めます。

**依存配列の順序ルール:**
functionsを他のhookの依存配列に含める場合、基本的に最後尾に配置しますが、`latest`（useLatestの結果）よりは前に配置します：

```typescript
const latest = useLatest({ onChange, onSubmit })

const functions = useMemo(() => ({
  handleChange: () => latest.onChange?.(),
}), [latest])

// ✅ 正しい依存配列の順序
useEffect(() => {
  // 何らかの処理
}, [value, isOpen, functions, latest])
//  ↑通常の値  ↑functions  ↑latest（最後）

// ❌ 誤った順序
useEffect(() => {
  // 何らかの処理
}, [value, latest, functions])  // latestがfunctionsより前は不適切
```

**理由:**
- functionsは基本的に再作成されないが、可能性はゼロではない
- latestは確実に再作成されない（useLatestの内部実装による保証）
- 再作成の可能性がより低いものを依存配列の後ろに配置することで、実行速度の最適化と可読性・意図の明確化を実現
  - 依存配列のチェックは前から順に行われるため、変更される可能性が高いものを前に配置すれば早期に変更を検出できる
  - 変更されにくいものを後ろに配置することで、無駄な比較処理を削減

#### イベント移譲（Event Delegation）パターン

大量の子要素に個別のイベントハンドラーを設定する代わりに、コンテナ1つにハンドラーを設定してイベントを受け取る手法です。

**使用する判断基準:**
- 子要素が多い（例: リスト、選択肢）かつ各要素のハンドラーが同種の処理をする場合

**`findDelegateTarget` の使用（`src/libs/delegate.ts`）:**

CSS selectorで対象要素を絞り込む汎用ユーティリティです。`e.target` ではなく `e.nativeEvent.composedPath()` を使うことで、イベントの実際の伝播パスのみを対象にし、発生元を正確に特定できます。

```typescript
import { findDelegateTarget } from '../../libs/delegate'

// コンテナにdelegateハンドラーを設定
<ul
  onClick={functions.handleDelegateClick}
  onMouseOver={functions.handleDelegateMouseOver}
>
  {items.map(({ id, label }) => (
    <button key={id} id={id} role="option">{label}</button>
  ))}
</ul>

// useLatest + functions パターンと組み合わせる
const functions = useMemo(() => ({
  handleDelegateClick: (e: MouseEvent) => {
    const el = findDelegateTarget<HTMLButtonElement>(e, 'button[role="option"]')
    if (!el || el.disabled) return
    const item = latest.items.find((o) => o.id === el.id)
    if (item) latest.onSelect(item)
  },
  handleDelegateMouseOver: (e: MouseEvent) => {
    const el = findDelegateTarget<HTMLButtonElement>(e, 'button[role="option"]')
    if (!el || el.disabled) return
    latest.onHover(el.id)
  },
}), [latest])
```

**命名規則:** delegateハンドラーは `handleDelegateXxx` 形式

**子要素の識別には `id` を使う:**
- `id` は `useId()` ベースで一意性が保証される
- `value` は重複の可能性があるため不適切

#### useImperativeHandle の依存配列

`useImperativeHandle` には**必ず依存配列を指定**します。

**理由:** 依存配列を省略すると、毎レンダリングで React がcleanupとして `ref(null)` を呼んだあと `ref(node)` を再実行します。これによりcallback refを使う親コンポーネントで不要な処理（DOM操作、副作用など）が毎レンダリング走ります。

**依存配列の決め方:**

```typescript
// ✅ factory が ref.current を返すだけ、かつ
//    その要素が初回コミットで無条件にマウントされる → []
// DOM要素はコンポーネントのライフタイム中に変わらないため、初回のみ実行すれば十分
useImperativeHandle(ref, () => innerRef.current, [])

// ✅ 条件付きマウント（portal、遅延描画など）
//    マウントを制御する値を依存配列に含める
// eslint-disable-next-line react-hooks/exhaustive-deps
useImperativeHandle(ref, () => containerRef.current, [portalRoot])

// ✅ factory がオブジェクトを返し、中身が useCallback の値に依存する → [theCallback]
// focus が変わったときのみ ref を再作成する
const focus = useCallback(() => {
  firstFocusTarget?.current?.focus()
}, [firstFocusTarget])

useImperativeHandle(ref, () => ({ focus }), [focus])

// ✅ as prop でレンダリングする DOM 要素が変わる場合 → [Component]
// factory 内で Component を参照しないが、レンダリング要素が変わると ref が指す型も変わるため必要
// eslint-disable-next-line react-hooks/exhaustive-deps
useImperativeHandle(ref, () => wrapperRef.current!, [Component])
```

**依存配列に含めないもの:**

- factory 内で参照していない値
  - ただし「ref 対象の（再）マウントを引き起こす値」は例外（`as` の `Component`、portal の `portalRoot` など）
- `ref` 自体（React が内部で管理するため不要）

```typescript
// ❌ 依存配列を省略してはいけない
useImperativeHandle(ref, () => innerRef.current)
```

#### useMergeRefs

複数の ref（`RefObject` や callback ref）を1つの callback ref に統合したい場合は `useMergeRefs`（`src/hooks/useMergeRefs.ts`）を使います。

```typescript
const mergedRef = useMergeRefs(innerRef, functions.callbackRef, ref)

return <input ref={mergedRef} />
```

**外部から渡された `ref` は最後に配置する**

外部から渡された `ref` は他の内部 ref の状態に依存しない独立した存在であることがほとんどです。常に最後に配置する規約にすることで、内部 ref 同士の依存関係だけを考慮すればよくなり、可読性・汎用性が上がります。

**❌ useImperativeHandle を使うべきではないパターン: DOM ノードをそのまま外部 ref に渡すためだけの中継**

外部から渡された `ref` に、内部の DOM ノードをそのまま渡したいだけの場合（＝独自の命令的 API を提供するわけではない場合）に `useImperativeHandle` を使うのはアンチパターンです。callback ref の中で `innerRef.current = node` のように無理やり別 ref の `current` に値を詰める実装も同様に避けます。

```tsx
// ❌ callbackRefでinnerRef.currentに無理やり詰めて、useImperativeHandleで中継するだけ
const innerRef = useRef<HTMLInputElement>(null)

useImperativeHandle(ref, () => innerRef.current, [])

const functions = useMemo(
  () => ({
    handleInnerRef: (node: HTMLInputElement | null) => {
      innerRef.current = node
      if (latest.autoFocus && node) {
        node.focus()
      }
    },
  }),
  [latest],
)

return <input ref={functions.handleInnerRef} />

// ✅ useMergeRefsでrefをそのまま統合する。innerRefへの代入処理が不要になる
const functions = useMemo(
  () => ({
    callbackRef: (node: HTMLInputElement | null) => {
      if (node && latest.autoFocus) {
        node.focus()
      }
    },
  }),
  [latest],
)

const mergedRef = useMergeRefs(functions.callbackRef, ref)

return <input ref={mergedRef} />
```

このように `useMergeRefs` を使うことで、「別の ref の `current` に値を詰めるためだけの callback ref」と「外部 ref への中継のためだけの `useImperativeHandle`」の両方を排除できます。

**✅ useImperativeHandle で良いパターン: 独自の命令的 API を公開する場合**

DOM ノードそのものではなく、独自メソッドを持つオブジェクトを公開する場合は `useImperativeHandle` が適切です。この場合 `useMergeRefs` の出番はありません。

```tsx
const innerRef = useRef<HTMLDivElement | null>(null)

const focus = useCallback(() => {
  innerRef.current?.focus()
}, [])

useImperativeHandle(ref, () => ({ focus }), [focus])
```

**✅ useMergeRefs を使うそれ以外のパターン: 外部 ref・内部参照用 ref・マウント時処理用 callback ref の統合**

`CurrencyInput` のように、外部から渡される `ref`、内部で値を読み書きするための `innerRef`、マウント時に副作用を実行する callback ref を同時に使いたい場合にも `useMergeRefs` が使えます。

```tsx
const innerRef = useRef<HTMLInputElement>(null)

const functions = useMemo(() => {
  const formatValue = (formatted = '') => {
    if (innerRef.current && formatted !== innerRef.current.value) {
      innerRef.current.value = formatted
    }
  }

  return {
    callbackRef: (node: HTMLInputElement | null) => {
      if (node && latest.defaultValue !== undefined) {
        formatValue(formatCurrency(latest.defaultValue))
      }
    },
  }
}, [latest])

const mergedRef = useMergeRefs(innerRef, functions.callbackRef, ref)
```

**⚠️ 注意: ref の渡す順序が実行順序を決める**

`useMergeRefs` は渡された ref を**配列の順序どおり**に処理します。マウント時は先頭から順に `setRef` が実行され、アンマウント時はその**逆順**で cleanup が実行されます。あるrefのcallbackが別のrefの`current`に依存する場合、依存先のrefは「設定は先に・後片付けは後に」行われる必要があるため、この逆順cleanupによって、mount時に成立していた依存関係の前提がcleanup時にも保たれます。

あるコールバックが別の ref の `current` を参照する場合、参照される側の ref を**先に**渡す必要があります。上記の `CurrencyInput` の例では、`functions.callbackRef` が `innerRef.current` を読むため、`innerRef` を `functions.callbackRef` より前に渡しています。

```tsx
// ✅ innerRefが先に設定されるため、callbackRef実行時にはinnerRef.currentが利用可能
const mergedRef = useMergeRefs(innerRef, functions.callbackRef, ref)

// ❌ innerRefとcallbackRefの順序を逆にすると、callbackRef実行時点でinnerRef.currentがまだnullのまま
const mergedRef = useMergeRefs(functions.callbackRef, innerRef, ref)
```

#### callback ref の cleanup 関数と React 18/19 互換性

React 19 では callback ref がcleanup関数を返せるようになり、要素がデタッチされる際にReactが自動で実行します。しかし React 18 にはこの仕組みがなく、返り値は無視されて `ref(null)` が呼ばれるだけです。smarthr-ui は `react: "^18.0.0 || ^19.0.0"` を peerDependency としてサポートしているため、callback ref から直接cleanup関数を返す実装は避けてください。

```tsx
// ❌ React 19でしか正しく動作しない（React 18ではcleanup関数が無視される）
const callbackRef = useCallback((node: HTMLElement | null) => {
  if (!node) return

  const observer = new MutationObserver(callback)
  observer.observe(node, { childList: true })

  return () => observer.disconnect()
}, [])
```

**対応方法:**
- 単一の ref を扱う場合は `useCallbackRefCleanupForReact18`（`src/hooks/useCallbackRefCleanupForReact18.ts`）でラップする
- 複数の ref を1つに統合する場合は `useMergeRefs` を使う（内部で同じ仕組みを実装済み）

どちらも「callback が返した cleanup 関数を自前で保持しておき、`node = null` で呼ばれたときに手動で実行する」という同じ仕組みで React 18/19 の挙動を統一しています。そのため、これらのフックを経由すれば callback ref の cleanup 関数はどちらのバージョンでも正しく動作します。

```tsx
// ✅ useCallbackRefCleanupForReact18でラップする
const callbackRef = useCallbackRefCleanupForReact18(
  useCallback((node: HTMLElement | null) => {
    if (!node) return

    const observer = new MutationObserver(callback)
    observer.observe(node, { childList: true })

    return () => observer.disconnect()
  }, []),
)
```

#### useOnce

渡した callback を初回の呼び出しでのみ実行し、2回目以降は何もしない（`undefined` を返す）ようにラップするフックです（`src/hooks/useOnce.ts`）。callback ref のように複数回呼び出される可能性がある処理を、マウント時に一度だけ実行したい場合に使います。

```tsx
const callbackRef = useOnce((node: HTMLInputElement | null) => {
  if (node && autoFocus) {
    node.focus()
  }
})

const mergedRef = useMergeRefs(callbackRef, ref)
```

**手動で実行済みフラグを管理する実装との違い:**

`useRef(false)` で実行済みフラグを自前管理する代わりに `useOnce` を使うことで、フラグの読み書きやガード条件の重複を排除できます。

```tsx
// ❌ 実行済みフラグを手動管理
const executedAutoFocus = useRef(false)

const callbackRef = (node: HTMLInputElement | null) => {
  if (node && autoFocus && !executedAutoFocus.current) {
    node.focus()
    executedAutoFocus.current = true
  }
}

// ✅ useOnceでラップし、実行済みかどうかの判定を委譲する
const callbackRef = useOnce((node: HTMLInputElement | null) => {
  if (node && autoFocus) {
    node.focus()
  }
})
```

**`useOnce` に渡す callback 内で `latest.xxx` を参照することはできない**

`local-rules/best-practice-for-use-latest` は `latest.xxx` のプロパティアクセスを `useEffect`/`useLayoutEffect`/`useCallback`/`useMemo` 内でのみ許可しており、`useOnce` は対象外です。`latest.xxx` を参照したい場合は、既存の `functions` パターン（`useMemo`）の中で callback を定義し、それを `useOnce` に渡してください。

```tsx
// ❌ useOnceに渡すcallback内で直接latestを参照
const latest = useLatest({ onFormatValue, defaultValue })

const callbackRef = useOnce((node: HTMLInputElement | null) => {
  if (node && latest.defaultValue !== undefined) {
    latest.onFormatValue?.(latest.defaultValue)
  }
})

// ✅ functionsパターンでlatestを参照するcallbackを定義し、それをuseOnceに渡す
const latest = useLatest({ onFormatValue, defaultValue })

const functions = useMemo(
  () => ({
    baseCallbackRef: (node: HTMLInputElement | null) => {
      if (node && latest.defaultValue !== undefined) {
        latest.onFormatValue?.(latest.defaultValue)
      }
    },
  }),
  [latest],
)

const callbackRef = useOnce(functions.baseCallbackRef)
```

#### useEffectではなく他の手段で可能な場合

`useEffect` は「Reactの外の世界と同期する」ための最終手段です。乱用すると処理のきっかけやタイミングが読み取りにくくなるため、以下のケースでは `useEffect` より適切な手段を優先してください。

**1. DOM要素のmount/unmountに連動する処理 → callback ref化**

```tsx
// ❌ useRef + useEffectでDOM操作（要素との結びつきがref.current経由で間接的）
const listRef = useRef<HTMLUListElement>(null)

useEffect(() => {
  if (!listRef.current) return
  const observer = new MutationObserver(callback)
  observer.observe(listRef.current, { childList: true })
  return () => observer.disconnect()
}, [])

// ✅ callback refに直接書く（要素がアタッチされた瞬間に実行されることが一目でわかる）
const callbackRef = useCallbackRefCleanupForReact18(
  useCallback((node: HTMLUListElement | null) => {
    if (!node) return
    const observer = new MutationObserver(callback)
    observer.observe(node, { childList: true })
    return () => observer.disconnect()
  }, []),
)
```

**理由:** `ref.current` 経由の間接参照ではなく、要素のアタッチ/デタッチそのものにロジックを紐付けられる。cleanup関数を返す場合はReact 18互換のため `useCallbackRefCleanupForReact18`（または `useMergeRefs`）でラップする。

**2. マウント時に一度だけ計算する初期値 → useStateの遅延初期化**

```tsx
// ❌ 空文字でレンダー→useEffectで正しい値に更新、という無駄な二度手間
const [label, setLabel] = useState('')
useEffect(() => {
  setLabel((fields.find((f) => f.selected) || fields[0])?.label || '')
}, [])

// ✅ 遅延初期化なら初回から正しい値、計算も1回だけ
const [label] = useState(() => (fields.find((f) => f.selected) || fields[0])?.label || '')
```

**理由:** `useEffect` 版は不要な再レンダリングが発生する。遅延初期化は初回レンダリング時に1回だけ実行される。

**3. イベントに起因する遅延処理 → イベントハンドラ内でuseAnimationFrameのrequestを呼ぶ**

```tsx
// ❌ activeの変化を監視して間接的にrequestAnimationFrameを予約
useEffect(() => {
  if (active) {
    const id = requestAnimationFrame(() => onOpen?.())
    return () => cancelAnimationFrame(id)
  }
}, [active, onOpen])

// ✅ イベントハンドラ内に書けば「何がきっかけで」「何を遅延実行するか」が同じ場所にある
const openFrame = useAnimationFrame()
const handleClickTrigger = () => {
  setActive(true)
  // HINT: コンポーネントのunmount時にopenFrame.cancelを呼ぶことを忘れずに行う
  openFrame.request(() => onOpen?.())
}
```

**理由:** `useEffect` 版はstateの変化という間接的なトリガーしか手がかりがなく、どの操作に起因する処理か追いにくい。

**4. 外部ストア（ブラウザAPIなど）の購読 → useSyncExternalStore**

```tsx
// ❌ useState + useEffectでmatchMediaを購読
const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
useEffect(() => {
  const mql = window.matchMedia(query)
  const handler = () => setMatches(mql.matches)
  mql.addEventListener('change', handler)
  return () => mql.removeEventListener('change', handler)
}, [query])

// ✅ useSyncExternalStoreならReactのレンダリングサイクルと正しく同期する
const matches = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
```

**理由:** `useState` + `useEffect` の組み合わせは、外部イベントとReactの再レンダリングタイミングがズレる場合がある（tearingの原因になりうる）。ブラウザAPIやDOM状態など「Reactの外にあるミュータブルな値」を購読する場合は `useSyncExternalStore` が本来の解決手段（実例: `useMediaQueries.ts`, `Tooltip.tsx`）。

**5. props/stateから直接計算できる値 → レンダー中に計算する（or useMemo）**

```tsx
// ❌ 派生値をuseEffectでstateに同期
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// ✅ レンダー中にそのまま計算する（stateにする必要がない）
const fullName = `${firstName} ${lastName}`
```

**理由:** 単純な派生値のためだけに `state` と `useEffect` を使うと、レンダーが1回余分に発生し、値が一時的に古いまま表示される瞬間が生まれる。計算コストが高い場合のみ `useMemo` を使う。

## スキル

- **PR作成** (`.claude/skills/pr-creator/`): PR作成時にリポジトリのテンプレートに沿った本文を生成する
