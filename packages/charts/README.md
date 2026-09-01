# smarthr-ui-charts

React で構築された SmartHR UI 向けのチャートコンポーネントライブラリです。

## 概要

smarthr-ui-charts は、SmartHR UI デザインシステムとシームレスに統合するチャートコンポーネントのコレクションを提供します。smarthr-ui メインライブラリと同じカラーパレット、テーマシステム、デザイン原則を使用しています。

## インストール

**注意: このパッケージは現在開発中です。**

```bash
# パッケージが公開されたら利用可能になります
npm install smarthr-ui-charts

# 必要な peer dependencies
npm install smarthr-ui react react-dom styled-components
```

## 多言語対応

チャートのスクリーンリーダー向けテキスト（`aria-label` やキーボード操作時の読み上げ）は、smarthr-ui の `IntlProvider` に指定したロケールに追従します。

```tsx
import { BarChart } from '@smarthr/smarthr-ui-charts'
import { IntlProvider } from 'smarthr-ui'

const App = () => (
  <IntlProvider locale="en-us">
    <BarChart data={data} />
  </IntlProvider>
)
```

smarthr-ui のコンポーネントと同様に `IntlProvider` の設置が必要です。対象ロケールの翻訳がまだ存在しない場合は日本語で表示されます。

翻訳辞書は `src/intl/locales/ja.ts` を原文（SSOT）とし、Crowdin を通じて各言語に翻訳されます。文言を追加・変更する場合は `ja.ts` のみを編集し、`pnpm charts format:eslint` を実行して `ja.json` を同期してください。他の言語の JSON は直接編集しません。

## 開発状況

このパッケージは現在、企画・初期開発段階にあります。チャートコンポーネントは段階的に追加される予定です。
