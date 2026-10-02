import { getFromDate, getMonthArray, getToDate, isBetween } from './calendarHelper'

// eslint-disable-next-line smarthr/best-practice-for-date
const INVALID_DATE = new Date('aaa')

describe('calendarHelper', () => {
  describe('getFromDate', () => {
    it('returns given date when date is after 1900-01-01', () => {
      const actual = getFromDate(new Date(2020, 5, 15))
      expect(actual.getFullYear()).toBe(2020)
      expect(actual.getMonth()).toBe(5)
      expect(actual.getDate()).toBe(15)
    })
    it('returns 1900-01-01 when date is before 1900-01-01', () => {
      const actual = getFromDate(new Date(1000, 5, 15))
      expect(actual.getFullYear()).toBe(1900)
      expect(actual.getMonth()).toBe(0)
      expect(actual.getDate()).toBe(1)
    })
    it('returns 1900-01-01 when date is invalid', () => {
      const actual = getFromDate(INVALID_DATE)
      expect(actual.getFullYear()).toBe(1900)
      expect(actual.getMonth()).toBe(0)
      expect(actual.getDate()).toBe(1)
    })
  })

  describe('getToDate', () => {
    it('returns given date when date is before 9999-12-31', () => {
      const actual = getToDate(new Date(2020, 6, 16))
      expect(actual.getFullYear()).toBe(2020)
      expect(actual.getMonth()).toBe(6)
      expect(actual.getDate()).toBe(16)
    })
    it('returns 9999-12-31 when date is after 9999-12-31', () => {
      const actual = getToDate(new Date(10000, 6, 16))
      expect(actual.getFullYear()).toBe(9999)
      expect(actual.getMonth()).toBe(11)
      expect(actual.getDate()).toBe(31)
    })
    it('returns date of today in 50 years time when date is not given', () => {
      const now = new Date()
      const actual = getToDate()
      expect(actual.getFullYear()).toBe(now.getFullYear() + 50)
      expect(actual.getMonth()).toBe(now.getMonth())
      expect(actual.getDate()).toBe(now.getDate())
    })
    it('returns date of today in 50 years time when date is invalid', () => {
      const now = new Date()

      const actual = getToDate(INVALID_DATE)
      expect(actual.getFullYear()).toBe(now.getFullYear() + 50)
      expect(actual.getMonth()).toBe(now.getMonth())
      expect(actual.getDate()).toBe(now.getDate())
    })
  })

  describe('getMonthArray', () => {
    it('returns calendar array of month of the beginning of year', () => {
      const date = new Date(2020, 0, 1) // 2020-01-01 (水曜日)
      // 2020年1月1日は水曜日、日曜日開始の週では4番目の位置（index 3）
      const expected = [
        [null, null, null, 1, 2, 3, 4],
        [5, 6, 7, 8, 9, 10, 11],
        [12, 13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24, 25],
        [26, 27, 28, 29, 30, 31, null],
      ]
      expect(getMonthArray(date)).toEqual(expected)
    })

    it('returns calendar array of month of the end of year', () => {
      const date = new Date(2020, 11, 31) // 2020-12-31 (木曜日)
      const expected = [
        [null, null, 1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24, 25, 26],
        [27, 28, 29, 30, 31, null, null],
      ]
      expect(getMonthArray(date)).toEqual(expected)
    })

    it('returns calendar array of February of the leap year', () => {
      const date = new Date(2020, 1, 1) // 2020-02-01 (土曜日)
      const expected = [
        [null, null, null, null, null, null, 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 29],
      ]
      expect(getMonthArray(date)).toEqual(expected)
    })

    describe('with different week start days', () => {
      const date = new Date(2020, 6, 1) // 2020-07-01 (水曜日)
      it('returns correct calendar array for Sunday start (weekStartDay = 0)', () => {
        const expected = [
          [null, null, null, 1, 2, 3, 4],
          [5, 6, 7, 8, 9, 10, 11],
          [12, 13, 14, 15, 16, 17, 18],
          [19, 20, 21, 22, 23, 24, 25],
          [26, 27, 28, 29, 30, 31, null],
        ]
        expect(getMonthArray(date, 0)).toEqual(expected)
      })

      it('returns correct calendar array for Monday start (weekStartDay = 1)', () => {
        const expected = [
          [null, null, 1, 2, 3, 4, 5],
          [6, 7, 8, 9, 10, 11, 12],
          [13, 14, 15, 16, 17, 18, 19],
          [20, 21, 22, 23, 24, 25, 26],
          [27, 28, 29, 30, 31, null, null],
        ]
        expect(getMonthArray(date, 1)).toEqual(expected)
      })

      it('returns correct calendar array for Saturday start (weekStartDay = 6)', () => {
        const expected = [
          [null, null, null, null, 1, 2, 3],
          [4, 5, 6, 7, 8, 9, 10],
          [11, 12, 13, 14, 15, 16, 17],
          [18, 19, 20, 21, 22, 23, 24],
          [25, 26, 27, 28, 29, 30, 31],
        ]
        expect(getMonthArray(date, 6)).toEqual(expected)
      })
    })
  })

  describe('isBetween', () => {
    it('returns true when [date] is between [from] and [to]', () => {
      const date = new Date(2020, 5, 1)
      const from = new Date(2019, 0, 1)
      const to = new Date(2021, 0, 1)
      expect(isBetween(date, from, to)).toBeTruthy()
    })

    it('returns false when [date] is not between [from] and [to]', () => {
      const date = new Date(2022, 5, 1)
      const from = new Date(2019, 0, 1)
      const to = new Date(2021, 0, 1)
      expect(isBetween(date, from, to)).toBeFalsy()
    })

    it('returns true when [date] is equal to [from]', () => {
      const date = new Date(2019, 0, 1)
      const from = new Date(2019, 0, 1)
      const to = new Date(2021, 0, 1)
      expect(isBetween(date, from, to)).toBeTruthy()
    })

    it('returns true when [date] is equal to [to]', () => {
      const date = new Date(2021, 0, 1)
      const from = new Date(2019, 0, 1)
      const to = new Date(2021, 0, 1)
      expect(isBetween(date, from, to)).toBeTruthy()
    })
  })
})
