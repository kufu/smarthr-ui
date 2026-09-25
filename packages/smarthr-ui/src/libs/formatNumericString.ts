const MAPPER = {
  '−': '-',
  ー: '-',
  '．': '.',
  '０': '0',
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
} as const
/**
 * 数値文字列をフォーマットする。
 * 全角数字・ドット・マイナスを半角に変換し、整数部を3桁ごとにカンマ区切りにし、
 * 整数部の先頭のゼロと小数部の末尾のゼロを除去する。
 * 数値として解釈できない値が含まれる場合は、元の値をそのまま返す。
 */
export function formatNumericString(value?: string) {
  if (!value) {
    return ''
  }

  const converted = value
    .replace(/[０-９．−ー]/g, (s) => MAPPER[s as keyof typeof MAPPER] || s) // 全角数字・ドット・マイナスを半角に変換
    .replace(/^(-?)0+(?!\.|$)/, '$1') // 整数部の先頭のゼロを削除

  if (isNaN(Number(converted)) || converted.match(/[^0-9.-]/g)) {
    // 数値以外の文字が含まれる場合は元の値をそのまま返す
    return value
  }

  const [integerPart, decimalPart] = converted.split('.')
  const commaed = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // 整数部を3桁ごとにカンマ区切り

  if (decimalPart) {
    const excludedEndZero = decimalPart.replace(/0+$/, '') // 小数部の末尾のゼロを削除

    return excludedEndZero ? [commaed, excludedEndZero].join('.') : commaed
  }

  return commaed
}
