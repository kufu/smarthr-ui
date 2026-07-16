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

- **TypeScript**: `interface` ではなく `type` を使用（ESLint ルール `@typescript-eslint/consistent-type-definitions` で強制）
- **インポート**: インライン型インポートを使用（`import { type Foo }`）— `@typescript-eslint/consistent-type-imports` で強制
- **ワイルドカードの禁止**: `export *`、`export * as`、`import * as` は禁止（Icons のみ例外）
- **アクセシビリティ**: 厳格な jsx-a11y ルールを適用。`smarthr/a11y-*` カスタム ESLint ルールが有効
- **コンポーネント**: クライアントコンポーネントには `'use client'` ディレクティブを付与
- **コミット**: Conventional Commits 形式。commitlint (`@commitlint/config-conventional`) で検証される
  - type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`, `perf`, `style`, `build`, `revert`
  - scope: 任意。コンポーネント名を入れる（例: `fix(DropZone):`, `feat(StepFormDialog)!:`）
  - `!` 付きで破壊的変更を示す（例: `refactor!:`, `refactor(InformationPanel)!:`）
  - subject は日本語で記述（`subject-case` ルールは無効化されている）
  - リリースは release-please で管理。`feat` → minor、`fix` → patch、`!` → major
- **コンポーネントサイズ**: 大文字のサイズ値を使用（例: `'S'`、`'M'`、`'L'`）

### パフォーマンス最適化パターン

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

## スキル

- **PR作成** (`.claude/skills/pr-creator/`): PR作成時にリポジトリのテンプレートに沿った本文を生成する
