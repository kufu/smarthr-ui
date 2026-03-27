import { locale as enUs } from './en_us'
import { locale as idId } from './id_id'
import { locale as ja } from './ja'
import { locale as jaEasy } from './ja_easy'
import { locale as ko } from './ko_kr'
import { locale as pt } from './pt_br'
import { locale as vi } from './vi_vn'
import { locale as zhCn } from './zh_hans_cn'
import { locale as zhTw } from './zh_hant_tw'

export {
  ja,
  enUs as 'en-us',
  idId as 'id-id',
  pt,
  vi,
  ko,
  zhCn as 'zh-cn',
  zhTw as 'zh-tw',
  jaEasy as 'ja-easy',
}

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
