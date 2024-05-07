export function formatCurrency(value?: string) {
  if (!value) {
    return ''
  }
  const converted = value
    .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
    .replace(/[−ー]/, '-') // replace full-width minus
    .replace(/^(-?)0+(?!\.|$)/, '$1') // remove 0 at the front of integer part
  const nonNumericRegExp = /[^0-9.-]/g
  if (converted.match(nonNumericRegExp) || isNaN(Number(converted))) {
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
