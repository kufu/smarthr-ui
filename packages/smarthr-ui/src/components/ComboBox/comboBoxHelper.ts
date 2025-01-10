import innerText from 'react-innertext'

import { ComboBoxItem } from './types'

export function convertMatchableString(original: string) {
  return (
    original
      .replace(/\s/g, ' ')
      .replace(/’/g, "'")
      .replace(/[”“]/g, '"')
      .replace(/｀/g, '`')
      .replace(/￥/g, '¥')
      .replace(/−/g, '-')
      .replace(/〜/g, '~')
      // unicode で [！] から [｝] の間に定義されている英数・記号を半角に変換
      .replace(/[！-｝]/g, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0))
      .toLowerCase()
  )
}

export function areComboBoxItemsEqual<T>(a: ComboBoxItem<T>, b: ComboBoxItem<T>) {
  return a.value === b.value && innerText(a.label) === innerText(b.label)
}
