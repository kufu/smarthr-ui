import { getFromDate, getMonthArray, getToDate, isBetween } from './calendarHelper'

describe('calendarHelper', () => {
  describe('getFromDate', () => {
    it('returns given date when date is after 1970-01-01', () => {
      const date = new Date(2020, 0, 1)
      expect(getFromDate(date)).toEqual(new Date(2020, 0, 1))
    })
    it('returns 1970-01-01 when date is before 1970-01-01', () => {
      const date = new Date(1000, 0, 1)
      expect(getFromDate(date)).toEqual(new Date(1970, 0, 1))
    })
    it('returns 1970-01-01 when date is not given', () => {
      expect(getFromDate()).toEqual(new Date(1970, 0, 1))
    })
    it('returns 1970-01-01 when date is invalid', () => {
      const date = new Date('aaa')
      expect(getFromDate(date)).toEqual(new Date(1970, 0, 1))
    })
  })

  describe('getToDate', () => {
    it('returns given date when date is before 9999-12-31', () => {
      const date = new Date(2020, 0, 1)
      expect(getToDate(date)).toEqual(new Date(2020, 0, 1))
    })
    it('returns 9999-12-31 when date is after 9999-12-31', () => {
      const date = new Date(10000, 5, 1)
      expect(getToDate(date)).toEqual(new Date(9999, 11, 31))
    })
    it('returns date of today in 50 years time when date is not given', () => {
      const expected = new Date()
      expected.setFullYear(expected.getFullYear() + 50)
      expect(getToDate()).toEqual(expected)
    })
    it('returns date of today in 50 years time when date is invalid', () => {
      const date = new Date('aaa')
      const expected = new Date()
      expected.setFullYear(expected.getFullYear() + 50)
      expect(getToDate(date)).toEqual(expected)
    })
  })

  describe('getMonthArray', () => {
    it('returns calendar array of month of the begining of year', () => {
      const date = new Date(2020, 0, 1) // 2020-01-01
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
      const date = new Date(2025, 11, 31) // 2025-12-31
      const expected = [
        [null, 1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12, 13],
        [14, 15, 16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25, 26, 27],
        [28, 29, 30, 31, null, null, null],
      ]
      expect(getMonthArray(date)).toEqual(expected)
    })

    it('returns calendar array of February of the leap year', () => {
      const date = new Date(2020, 1, 1) // 2020-02-01
      const expected = [
        [null, null, null, null, null, null, 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 29],
      ]
      expect(getMonthArray(date)).toEqual(expected)
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
