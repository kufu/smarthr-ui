import { merge } from '../libs/lodash'

const defaultSpaceSize = 8

export type SizeProperty = {
  space?: {
    defaultRem?: number
    XXS?: number
    XS?: number
    S?: number
    M?: number
    L?: number
    XL?: number
    XXL?: number
  }
  mediaQuery?: {
    SP?: number
    TABLET?: number
  }
}

export type CreatedSizeTheme = {
  space: {
    XXS: number
    XS: number
    S: number
    M: number
    L: number
    XL: number
    XXL: number
  }
  mediaQuery: {
    SP: number
    TABLET: number
  }
}

const getSpace = (size: number) => ({
  XXS: size,
  XS: size * 2,
  S: size * 3,
  M: size * 4,
  L: size * 5,
  XL: size * 6,
  XXL: size * 7,
})

const defaultMediaQuery = { SP: 599, TABLET: 959 }

export const createSize = (userSize: SizeProperty = {}): CreatedSizeTheme => {
  const spaceSize = userSize.space?.defaultRem || defaultSpaceSize

  return merge(
    {
      space: getSpace(spaceSize),
      mediaQuery: { ...defaultMediaQuery },
    },
    userSize,
  )
}
