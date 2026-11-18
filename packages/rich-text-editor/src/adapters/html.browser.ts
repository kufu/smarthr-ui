// @tiptap/html の "." は browser 条件で browser 実装を返す。
// require 条件は browser/node を分けていないため、Node の CJS もここへ来てしまう。
// それを避けるために html.node.ts と package.json の imports で入口を分けている。
export { generateHTML, generateJSON } from '@tiptap/html'
