import { space } from '../createSpace'

describe('createSpacing', () => {
  it('returns same space theme with createSpace', () => {
    expect(space(0)).toBe(0)
    expect(space(0.25)).toBe('0.25rem')
    expect(space(0.5)).toBe('0.5rem')
    expect(space(0.75)).toBe('0.75rem')
    expect(space(1)).toBe('1rem')
    expect(space(1.25)).toBe('1.25rem')
    expect(space(1.5)).toBe('1.5rem')
    expect(space(2)).toBe('2rem')
    expect(space(2.5)).toBe('2.5rem')
    expect(space(3)).toBe('3rem')
    expect(space(4)).toBe('4rem')
    expect(space(8)).toBe('8rem')

    expect(space('1/4')).toBe('0.25rem')
    expect(space('1/2')).toBe('0.5rem')
    expect(space('3/4')).toBe('0.75rem')
    expect(space('5/4')).toBe('1.25rem')
    expect(space('3/2')).toBe('1.5rem')
  })

  it('returns same space theme with createSpace when give onlyNumber option', () => {
    expect(space(0, { onlyNumber: true })).toBe(0)
    expect(space(0.25, { onlyNumber: true })).toBe(0.25)
    expect(space(0.5, { onlyNumber: true })).toBe(0.5)
    expect(space(0.75, { onlyNumber: true })).toBe(0.75)
    expect(space(1, { onlyNumber: true })).toBe(1)
    expect(space(1.25, { onlyNumber: true })).toBe(1.25)
    expect(space(1.5, { onlyNumber: true })).toBe(1.5)
    expect(space(2, { onlyNumber: true })).toBe(2)
    expect(space(2.5, { onlyNumber: true })).toBe(2.5)
    expect(space(3, { onlyNumber: true })).toBe(3)
    expect(space(4, { onlyNumber: true })).toBe(4)
    expect(space(8, { onlyNumber: true })).toBe(8)

    expect(space('1/4', { onlyNumber: true })).toBe(0.25)
    expect(space('1/2', { onlyNumber: true })).toBe(0.5)
    expect(space('3/4', { onlyNumber: true })).toBe(0.75)
    expect(space('5/4', { onlyNumber: true })).toBe(1.25)
    expect(space('3/2', { onlyNumber: true })).toBe(1.5)
  })
})
