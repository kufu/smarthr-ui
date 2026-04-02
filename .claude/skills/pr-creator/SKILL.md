---
name: pr-creator
description: SmartHR UIリポジトリでPRを作成する際に、プロジェクトのPRテンプレートに沿った形式でPR本文を生成するスキル。PRの作成、`gh pr create`、プルリクエスト、マージリクエストなどのキーワードで発動する。ユーザーがPRを作りたいと言った場合や、作業完了後にPRを出すよう求められた場合にも使用すること。
---

# SmartHR UI PR作成スキル

このリポジトリでPRを作成する際は、以下のテンプレートとルールに従う。

## PRタイトル

Conventional Commits 形式で記述する。日本語で書く。

```
<type>(<scope>): <subject>
```

- type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test` など
- scope: コンポーネント名（任意）
- `!` で破壊的変更を示す（例: `refactor!:`, `feat(Dialog)!:`）
- subject: 変更内容が利用者に伝わるように書く（スカッシュマージのコミットメッセージがリリースノートに反映されるため）

**例:**
- `fix(DropZone): inputとButtonの両方にフォーカスが当たってしまうのを解消`
- `refactor!: コンポーネントサイズ指定を大文字に統一`
- `feat(StepFormDialog)!: onSubmitの内部の自由度を向上`

## PR本文テンプレート

以下の構造で記述する。HTMLコメントは含めない。各セクションは必ず記載し、該当なしの場合は「なし」と書く。

```markdown
## 関連URL

（関連するJIRAチケット、Slack URL、GitHub Issuesなどを記載）

## 概要

（PRを作成した目的や解決したい課題を簡潔に記載）

## 変更内容

（どのような変更を加えたのか、マージ後にどう変わるかを具体的に記載）

## プロダクト側で対応が必要な事項

（このPRの変更によりプロダクト側で対応が必要なことを記載。特に破壊的変更の場合は必須）

## 確認方法

（変更内容を確認する方法。Storybookでの確認で十分な場合はその旨を記載）
```

## セクション別の書き方ガイド

### 関連URL
- JIRAチケット、Slack、GitHub Issuesなど関連リンクを箇条書きで記載
- 関連URLがない場合は「なし」

### 概要
- PRの目的と背景を簡潔に書く
- 「なぜこの変更が必要か」が伝わるようにする

### 変更内容
- 具体的に何を変更したかを書く
- コンポーネントの新規追加やスタイル変更がある場合はキャプチャを添付する
- インタフェースの変更（特に破壊的変更）がある場合、Before/After のコード例を記載する

**Before/Afterの例:**
```markdown
### 変更例

```tsx
// Before
<Button size="default" />

// After
<Button size="M" />
```
```

### プロダクト側で対応が必要な事項
- プロダクト側での書き換えが必要な場合は具体的な対応方法を書く
- ここに書いた内容がリリースノートに転記されるため、利用者に伝わる内容にする
- 破壊的変更でない場合は「なし」

### 確認方法
- Storybookやテストでの確認方法を記載
- Chromatic での確認URLがあれば記載

## gh pr create の実行

PR本文は `gh pr create` の `--body` にHEREDOCで渡す：

```bash
gh pr create --title "<type>(<scope>): <subject>" --body "$(cat <<'EOF'
## 関連URL

なし

## 概要

...

## 変更内容

...

## プロダクト側で対応が必要な事項

なし

## 確認方法

...
EOF
)"
```
