<h1 align="center"><img src ="https://user-images.githubusercontent.com/44044475/70201779-f994de80-175a-11ea-90e1-8a69f5b13ff0.png" alt="SmartHR UI" title="SmartHR UI"></h1>

<div align="center">

SmartHR は、SmartHR 基本機能からはじまり、今では多くのオプション機能を提供しています。
SmartHR UI はそのすべてのアプリケーションの UI コンポーネントを共通化して、開発生産性や完成度を向上させるための UI コンポーネントライブラリです。

[![npm version](https://badge.fury.io/js/smarthr-ui.svg)](https://badge.fury.io/js/smarthr-ui)
[![CircleCI](https://circleci.com/gh/kufu/smarthr-ui.svg?style=shield)](https://circleci.com/gh/kufu/smarthr-ui)

</div>

## コンポーネント

`master`ブランチのコンポーネント一覧は Storybook から確認できます。
https://story.smarthr-ui.dev

## インストール

SmartHR-UI は[npm package](https://www.npmjs.com/package/smarthr-ui)として提供しています。

```sh
// with npm
npm install smarthr-ui

// with yarn
yarn add smarthr-ui

// with pnpm
pnpm add smarthr-ui
```

peerDependencies として React, React-DOM, styled-components が必要です。

```sh
// with npm
npm install react react-dom styled-components

// with yarn
yarn add react react-dom styled-components

// with pnpm
pnpm add react react-dom styled-components
```

## 使いかた

最もシンプルで簡単な使用例を紹介します。

```tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider, Button } from 'smarthr-ui'
import 'smarthr-ui/smarthr-ui.css'

const theme = createTheme()

const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Button variant="primary">Hello World</Button>
  </ThemeProvider>
)

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)
```

## コントリビュート

SmartHR UI は OSS です。[コントリビュート](https://github.com/kufu/smarthr-ui/blob/master/CONTRIBUTING.md)をお待ちしています。

## 更新履歴

更新履歴は[Releases](https://github.com/kufu/smarthr-ui/releases)を確認してください。

## デザイン・ロゴの利用について

- SmartHR UI のデザインデータは[Figma](https://www.figma.com/community/file/978607227374353992/SmartHR-UI)で公開しています。
- SmartHR のロゴを利用する場合は[SmartHR Design System](https://smarthr.design/)の利用規約を確認してください。

## ライセンス

このプロダクトは[MIT](https://github.com/kufu/smarthr-ui/blob/master/LICENSE)の条件に従ってライセンスされています。
