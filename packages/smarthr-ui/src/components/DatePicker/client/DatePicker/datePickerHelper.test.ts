import { parseJpnDateString } from './datePickerHelper'

describe('datePickerHelper', () => {
  describe('parseJpnDateString', () => {
    it('parse a date string of Meiji', () => {
      const expected = new Date(1869, 0, 1)
      expect(parseJpnDateString('明治2年1月1日')).toEqual(expected)
      expect(parseJpnDateString('m2-1-1')).toEqual(expected)
      expect(parseJpnDateString('M2-1-1')).toEqual(expected)
      expect(parseJpnDateString('Ｍ2-1-1')).toEqual(expected)
    })

    it('parse a date string of Taisho', () => {
      const expected = new Date(1913, 0, 1)
      expect(parseJpnDateString('大正2年1月1日')).toEqual(expected)
      expect(parseJpnDateString('t2-1-1')).toEqual(expected)
      expect(parseJpnDateString('T2-1-1')).toEqual(expected)
      expect(parseJpnDateString('Ｔ2-1-1')).toEqual(expected)
    })

    it('parse a date string of Showa', () => {
      const expected = new Date(1927, 0, 1)
      expect(parseJpnDateString('昭和2年1月1日')).toEqual(expected)
      expect(parseJpnDateString('s2-1-1')).toEqual(expected)
      expect(parseJpnDateString('S2-1-1')).toEqual(expected)
      expect(parseJpnDateString('Ｓ2-1-1')).toEqual(expected)
    })

    it('parse a date string of Heisei', () => {
      const expected = new Date(1990, 0, 1)
      expect(parseJpnDateString('平成2年1月1日')).toEqual(expected)
      expect(parseJpnDateString('h2-1-1')).toEqual(expected)
      expect(parseJpnDateString('H2-1-1')).toEqual(expected)
      expect(parseJpnDateString('Ｈ2-1-1')).toEqual(expected)
    })

    it('parse a date string of Reiwa', () => {
      const expected = new Date(2020, 0, 1)
      expect(parseJpnDateString('令和2年1月1日')).toEqual(expected)
      expect(parseJpnDateString('r2-1-1')).toEqual(expected)
      expect(parseJpnDateString('R2-1-1')).toEqual(expected)
      expect(parseJpnDateString('Ｒ2-1-1')).toEqual(expected)
    })

    it('parse a date string of japanese era that is an expected format', () => {
      const expected = new Date(2020, 0, 1)
      expect(parseJpnDateString('r2:1:1')).toEqual(expected)
      expect(parseJpnDateString('r2/1/1')).toEqual(expected)
      expect(parseJpnDateString('r2-1-1')).toEqual(expected)
      expect(parseJpnDateString('r2.1.1')).toEqual(expected)
      expect(parseJpnDateString('r2 1 1')).toEqual(expected)
      expect(parseJpnDateString('r2．1．1')).toEqual(expected)
      expect(parseJpnDateString('r2年1月1日')).toEqual(expected)
      expect(parseJpnDateString('r02:01:01')).toEqual(expected)
      expect(parseJpnDateString('r10:12:31')).toEqual(new Date(2028, 11, 31))
    })

    it('parse date string of A.D. that is an expected format', () => {
      const expected = new Date(2020, 0, 1)
      expect(parseJpnDateString('2020:1:1')).toEqual(expected)
      expect(parseJpnDateString('2020/1/1')).toEqual(expected)
      expect(parseJpnDateString('2020-1-1')).toEqual(expected)
      expect(parseJpnDateString('2020.1.1')).toEqual(expected)
      expect(parseJpnDateString('2020 1 1')).toEqual(expected)
      expect(parseJpnDateString('2020．1．1')).toEqual(expected)
      expect(parseJpnDateString('2020年1月1日')).toEqual(expected)
      expect(parseJpnDateString('20200101')).toEqual(expected)
      expect(parseJpnDateString('1999:12:31')).toEqual(new Date(1999, 11, 31))
    })
  })
})
