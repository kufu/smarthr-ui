// browser 実装は Node で例外を投げるため、サーバーでは server 入口を明示的に解決する。
// @tiptap/html の require 条件は browser 実装しか指しておらず、"." 経由では選べない。
export { generateHTML, generateJSON } from '@tiptap/html/server'
