import { FaAddressBookIcon } from '../components/Icon'

type AnyObjectType = { [key: string]: any }

export const pictParser = <T extends AnyObjectType>(
  pict: string,
  formatter?: (vs: { [key: string]: any }) => T,
) => {
  const lines = pict.split('\n')
  const header = lines.shift()!.split('\t')
  const reducer = (prev: AnyObjectType, c: string, i: number) => {
    prev[header[i]] = valueConverter(i === 0 ? c.replace(/^(\s|\t)+/, '') : c)

    return prev
  }

  return lines.map((line) => {
    const result = line.split('\t').reduce(reducer, {} as T)

    return formatter ? formatter(result) : result
  })
}

const NUM_REGEX = /^([0-9]+|[0-9]+\.[0-9]+)$/
const valueConverter = (v: string): any => {
  switch (v) {
    case 'undefined':
      return undefined
    case 'null':
      return null
    case 'true':
      return true
    case 'false':
      return false
    case '<Icon />':
      return <FaAddressBookIcon />
  }

  // HINT: 整数 or 少数含む数値の場合数値変換
  if (NUM_REGEX.test(v)) {
    return parseFloat(v)
  }

  return v
}
