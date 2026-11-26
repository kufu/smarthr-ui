# Changelog

## [0.2.0](https://github.com/kufu/smarthr-ui/compare/rich-text-editor-v0.1.2...rich-text-editor-v0.2.0) (2026-11-26)


### ⚠ BREAKING CHANGES

* Reactの最低要求バージョンを19.2.0に引き上げる ([#7590](https://github.com/kufu/smarthr-ui/issues/7590))

### Features

* **RichTextEditor:** アップロード済みの動画を本文に埋め込めるようにする ([#7558](https://github.com/kufu/smarthr-ui/issues/7558)) ([16170dd](https://github.com/kufu/smarthr-ui/commit/16170dd3cb4da714206650b31ea92944e8be0247))
* **RichTextEditor:** スラッシュコマンドでブロックと色を挿入できるようにする ([#7559](https://github.com/kufu/smarthr-ui/issues/7559)) ([808a959](https://github.com/kufu/smarthr-ui/commit/808a95937d224305a5909a639ef361746934dbad))
* **RichTextEditor:** ブロックを移動・複製・削除・変換できるようにする ([#7579](https://github.com/kufu/smarthr-ui/issues/7579)) ([bb2d622](https://github.com/kufu/smarthr-ui/commit/bb2d6225573f0b268c7278cdf78d5eefb0368a58))


### Bug Fixes

* ブラウザの自動翻訳機能によるクラッシュを防ぐSafeBrowserTranslationとそれを検知するESLintルールを追加する ([#7642](https://github.com/kufu/smarthr-ui/issues/7642)) ([9ee78d9](https://github.com/kufu/smarthr-ui/commit/9ee78d98c82ea6c8af3e581738635f06184cd3e6))


### Miscellaneous Chores

* Reactの最低要求バージョンを19.2.0に引き上げる ([#7590](https://github.com/kufu/smarthr-ui/issues/7590)) ([0be6e21](https://github.com/kufu/smarthr-ui/commit/0be6e217ab2b6530abbfed786fa81db476037121))

## [0.1.2](https://github.com/kufu/smarthr-ui/compare/rich-text-editor-v0.1.1...rich-text-editor-v0.1.2) (2026-11-19)


### Features

* best-practice-for-functions-depsでfunctionsと同スコープのuseCallback使用を禁止する ([#7588](https://github.com/kufu/smarthr-ui/issues/7588)) ([cc7c3b7](https://github.com/kufu/smarthr-ui/commit/cc7c3b7d5b4e0e9b27b2b598da3450e7642223c0))
* best-practice-for-use-latestにlatestプロパティの即時代入キャプチャ検知を追加する ([#7584](https://github.com/kufu/smarthr-ui/issues/7584)) ([8dcd34c](https://github.com/kufu/smarthr-ui/commit/8dcd34ceb59cbd4cb4d3b1191320c0dac5bfa0fa))
* functionsのuseMemo依存配列を検知するESLintルールを追加する ([#7583](https://github.com/kufu/smarthr-ui/issues/7583)) ([02ace01](https://github.com/kufu/smarthr-ui/commit/02ace01a0fbec583beca333ed96578bb1def56e2))

## [0.1.1](https://github.com/kufu/smarthr-ui/compare/rich-text-editor-v0.1.0...rich-text-editor-v0.1.1) (2026-11-12)


### Bug Fixes

* **RichTextViewer:** ブロックの間隔・空白・コードブロックの表示をエディタとそろえる ([#7537](https://github.com/kufu/smarthr-ui/issues/7537)) ([5321430](https://github.com/kufu/smarthr-ui/commit/53214303c6d58b6aa5f08f51a420fd7aacf16f8e))

## 0.1.0 (2026-11-10)


### Features

* **RichTextEditor:** Tiptapベースのリッチテキストエディタを追加 ([#6269](https://github.com/kufu/smarthr-ui/issues/6269)) ([8540d4f](https://github.com/kufu/smarthr-ui/commit/8540d4f2b433a7347482d41e24bd78a27a9c84c7))


### Miscellaneous Chores

* リリースバージョンを99.6.1に固定する（再送） ([6efa754](https://github.com/kufu/smarthr-ui/commit/6efa754b5be397a74f5893c5f2a6ae222ac20349))
