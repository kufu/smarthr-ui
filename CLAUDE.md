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

## スキル

- **PR作成** (`.claude/skills/pr-creator/`): PR作成時にリポジトリのテンプレートに沿った本文を生成する
