import { locale as enUs } from './en_us'
import { locale as idId } from './id_id'
import { locale as ja } from './ja'
import { locale as jaEasy } from './ja_easy'
import { locale as ko } from './ko_kr'
import { locale as pt } from './pt_br'
import { locale as vi } from './vi_vn'
import { locale as zhCn } from './zh_hans_cn'
import { locale as zhTw } from './zh_hant_tw'

// 他のlocaleファイル（en_us.ts, id_id.ts等）が `import type { ja } from '.'` で型を参照するためにexport
export { ja }

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
