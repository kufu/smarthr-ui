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
}
export function formatCurrency(value?: string) {
  if (!value) {
    return ''
  }

  const converted = value
    .replace(/[０-９．−ー]/g, (s) => MAPPER[s] || s) // convert number and dot to half-width
    .replace(/^(-?)0+(?!\.|$)/, '$1') // remove 0 at the front of integer part

  if (isNaN(Number(converted)) || converted.match(/[^0-9.-]/g)) {
    // if value includes non-numeric characters, return value as it is
    // otherwise, we assume `converted` contains only numeric characters
    return value
  }

  const [integerPart, decimalPart] = converted.split('.')
  const commaed = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits

  if (!decimalPart) {
    return commaed
  }

  const excludedEndZero = decimalPart.replace(/0+$/, '')

  if (excludedEndZero.length === 0) {
    return commaed
  }

  return [commaed, excludedEndZero].join('.')
}
