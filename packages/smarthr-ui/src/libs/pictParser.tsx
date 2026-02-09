import { FaAddressBookIcon } from '../components/Icon'

export const pictParser = <T,>(pict: string, formatter: (vs: { [key: string]: any }) => T) => {
  const lines = pict.split('\n')
  const header = lines.shift()!.split('\t')

  return lines.map((line) =>
    formatter(
      line
        .split('\t')
        .map((c, i) => valueConverter(i === 0 ? c.replace(/^(\s|\t)+/, '') : c))
        .reduce((prev, c, i) => {
          prev[header[i]] = c

          return prev
        }, {} as T),
    ),
  )
}

const valueConverter = (v: string): any => {
  switch (v) {
    case 'undefined':
      return undefined
    case 'true':
      return true
    case 'false':
      return false
    case '<Icon />':
      return <FaAddressBookIcon />
  }

  if (/^[0-9]+$/.test(v)) {
    return parseInt(v, 10)
  }

  return v
}
