/*
 * 翻訳データの集約ファイル
 * このファイルはJSONファイルからデータをimportし、型定義のためにja.tsからのみ型をexportする特殊なファイルです。
 * barrel patternには該当しないため、require-barrel-importルールを無効化します。
 */
/* eslint-disable smarthr/require-barrel-import */
import enUs from './en_us.json'
import idId from './id_id.json'
import ja from './ja.json'
import jaEasy from './ja_easy.json'
import ko from './ko_kr.json'
import pt from './pt_br.json'
import vi from './vi_vn.json'
import zhCn from './zh_hans_cn.json'
import zhTw from './zh_hant_tw.json'

// 型定義用にja.tsの型をexport
export { locale as typedJa } from './ja'

export const locales = {
  ja,
  'en-us': enUs,
  'id-id': idId,
  pt,
  vi,
  ko,
  'zh-cn': zhCn,
  'zh-tw': zhTw,
  'ja-easy': jaEasy,
}
