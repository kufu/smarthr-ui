import dayjs from 'dayjs'

class JpnEra {
  from: Date
  constructor(from: Date) {
    this.from = from
  }

  getADYear(year: number): number {
    return year + this.from.getFullYear() - 1
  }
}

const meiji = new JpnEra(new Date(1868, 9, 23))
const taisho = new JpnEra(new Date(1912, 6, 30))
const showa = new JpnEra(new Date(1926, 11, 25))
const heisei = new JpnEra(new Date(1989, 0, 8))
const reiwa = new JpnEra(new Date(2019, 4, 1))

const jpnEraSignMap = new Map<string, JpnEra>([
  ['明治', meiji],
  ['m', meiji],
  ['M', meiji],
  ['Ｍ', meiji],
  ['大正', taisho],
  ['t', taisho],
  ['T', taisho],
  ['Ｔ', taisho],
  ['昭和', showa],
  ['s', showa],
  ['S', showa],
  ['Ｓ', showa],
  ['平成', heisei],
  ['h', heisei],
  ['H', heisei],
  ['Ｈ', heisei],
  ['令和', reiwa],
  ['r', reiwa],
  ['R', reiwa],
  ['Ｒ', reiwa],
])
const jpnEraSigns = Array.from(jpnEraSignMap.keys())

// this regexp includes [:], [/], [-], [.], [\s], [．], [年], [月], [日]
const dateSeparatorReg = '[:\\/\\-\\.\\s．年月日]'

export function parseJpnDateString(dateString: string): Date {
  // convert number from full-width to half-width
  const converted = dateString.replace(/[０-９．]/g, (s) =>
    String.fromCharCode(s.charCodeAt(0) - 0xfee0),
  )

  const matchedJpnEra = converted.match(
    `^(${jpnEraSigns.join(
      '|',
    )})([0-9]{1,2})(${dateSeparatorReg})([0-9]{1,2})(${dateSeparatorReg})([0-9]{1,2})(${dateSeparatorReg}?)$`,
  )
  if (matchedJpnEra) {
    // parse as japanese era
    const eraSign = matchedJpnEra[1]
    const year = Number(matchedJpnEra[2])
    const month = Number(matchedJpnEra[4])
    const date = Number(matchedJpnEra[6])
    const jpnEra = jpnEraSignMap.get(eraSign)
    if (jpnEra) {
      return new Date(jpnEra.getADYear(year), month - 1, date)
    }
  }

  const matchedAD = converted.match(
    `^([0-9]{4})(${dateSeparatorReg})?([0-9]{1,2})(${dateSeparatorReg})?([0-9]{1,2})(${dateSeparatorReg})?`,
  )
  if (matchedAD) {
    // parse as A.D.
    const year = Number(matchedAD[1])
    const month = Number(matchedAD[3])
    const date = Number(matchedAD[5])
    return new Date(year, month - 1, date)
  }

  return dayjs(converted).toDate()
}
