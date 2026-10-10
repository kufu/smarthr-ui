# @smarthr/smarthr-ui-rich-text-editor

SmartHR UI のリッチテキストエディタ。[Tiptap](https://tiptap.dev/) をベースにしています。

`smarthr-ui` 本体とは別のパッケージ・別のバージョンとして公開します。エディタの修正を、本体のバージョンを動かさずに適用・差し戻しできるようにするためです。

> **未公開です。** バージョン・peer の対応範囲は確定していません。

## インストール

```sh
pnpm add @smarthr/smarthr-ui-rich-text-editor
```

`smarthr-ui` / `react` / `react-dom` / `react-intl` は peerDependencies です。利用アプリ側で入れてください。React は 19 系のみ対応します。

依存に含まれる `happy-dom` は、`RichTextViewer` に HTML を渡してサーバーで描画するときにだけ使います（`@tiptap/html` のサーバー向けの実装が使用）。ブラウザ向けのバンドルには入りませんが、インストールはされます。

## 使い方

```tsx
import 'smarthr-ui/smarthr-ui.css'
import '@smarthr/smarthr-ui-rich-text-editor/styles.css'

import { RichTextEditor, RichTextViewer } from '@smarthr/smarthr-ui-rich-text-editor'
```

### CSS の読み込み順

`smarthr-ui.css` とエディタの CSS は、どちらを先に読み込んでも構いません。エディタの CSS のクラスは `shr-rte-` で始まり、本体の `shr-` のクラスとは別の規則です。要素への規則（`body`・`a`・`button` など）は本体と同じ値を両方が持つため、2つの間の順序は結果に影響しません。

アプリ独自に要素へ指定するスタイル（`a { color: … }` など）は、エディタの CSS より後に読み込んでください。先に読み込むと、エディタの CSS に含まれる要素への規則で上書きされます。クラスで指定するスタイル（styled-components・Tailwind など）は影響を受けません。

`className` でエディタの見た目を上書きする場合、エディタが指定しているプロパティ（文字色・行送りなど）は、エディタの CSS より後に読み込まれる CSS で指定してください。`smarthr-ui.css` にしか無いクラスを渡しても、読み込み順によってはエディタのクラスが優先されます。

エディタの CSS には全体に効く reset（preflight）は含まれません。本体と同じプリセット（`preflight: false`）で生成しているため、要素への規則は `smarthr-ui.css` にあるものと同じです。

### Provider

翻訳とテーマは本体のものを使います。エディタ専用の Provider はありません。

```tsx
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { RichTextEditor } from '@smarthr/smarthr-ui-rich-text-editor'

const App = () => (
  <IntlProvider locale="ja">
    <EnvironmentProvider>
      <RichTextEditor />
    </EnvironmentProvider>
  </IntlProvider>
)
```

`EnvironmentProvider` が無い環境ではモバイル判定が常に `false` になり、タッチ環境でもツールチップを描画します。ツールバーの構成は Provider の有無では変わりません。

## 開発

リポジトリルートから `pnpm rte <script>` で実行します。

lint の型チェックとテストは、本体のビルド成果物（`lib`）を参照します。本体を変更したら、先に `pnpm ui build` を実行してください。CSS のビルドは本体のプリセットをソース（`../smarthr-ui/src/smarthr-ui-preset`）から読むため、本体のビルドを必要としません。

```sh
pnpm rte lint        # eslint / knip / prettier / stylelint / tsc
pnpm rte lint:tsc    # 型チェックのみ
pnpm rte exec vitest run
pnpm rte build       # ESM / CJS / 型定義 / CSS
```

Storybook は本体パッケージのものに相乗りしています。`pnpm ui dev` で起動すると、このパッケージのストーリーも表示されます。

## 既知の制約

### smarthr-ui の Dropdown の中に置いた場合

Portal の親子関係を管理する `usePortal` を本体からコピーして持っているため、Context と採番が本体と共有されていません（採番の衝突は接頭辞 `rte-` で避けています）。

そのため **`Dropdown` の中にエディタを置き、エディタのツールバードロップダウンをクリックすると、外側の `Dropdown` が閉じます。** `Dialog` は `usePortal` を使っていないため影響を受けません。

共通 hook を [kufu/tamatebako](https://github.com/kufu/tamatebako) へ集約したうえで、本体・エディタの双方がそちらを参照するようになった時点で解消します。

### 翻訳

日本語以外は未翻訳で、日本語にフォールバックします。文言の差し替え口は用意していません。
