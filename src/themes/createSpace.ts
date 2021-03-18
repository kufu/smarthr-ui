const primitiveToken = {
  0: 0,
  0.25: 0.25,
  '1/4': 0.25,
  0.5: 0.5,
  '1/2': 0.5,
  0.75: 0.75,
  '3/4': 0.75,
  1: 1,
  1.25: 1.25,
  '5/4': 1.25,
  1.5: 1.5,
  '3/2': 1.5,
  2: 2,
  2.5: 2.5,
  3: 3,
  4: 4,
  8: 8,
}
export type SpaceLength = keyof typeof primitiveToken

export const space: (length: SpaceLength, options?: { onlyNumber: boolean }) => string | number = (
  length,
  { onlyNumber } = { onlyNumber: false },
) => {
  if (length === 0) {
    return 0
  }

  const result = primitiveToken[length]

  return onlyNumber ? Number(result) : `${result}rem`
}
