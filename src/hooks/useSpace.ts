import { useTheme } from '../hooks/useTheme'
import { space } from '../themes/createSpace'
import { defaultBaseSize } from '../themes/createSpacing'

const calcBaseSpace = defaultBaseSize * 2

export const useSpace: typeof space = (length, options) => {
  const {
    shinTheme,
    spacing,
    fontSize: { pxToRem },
  } = useTheme()

  if (!shinTheme) {
    // 旧テーマが space に対応していないのでマッピング
    switch (length) {
      case 0:
      default:
        return 0
      case 0.25:
      case '1/4':
        return pxToRem(calcBaseSpace * 0.25)
      case 0.5:
      case '1/2':
        return pxToRem(spacing.XXS)
      case 0.75:
      case '3/4':
        return pxToRem(calcBaseSpace * 0.75)
      case 1:
        return pxToRem(spacing.XS)
      case 1.25:
      case '5/4':
        return pxToRem(calcBaseSpace * 1.25)
      case 1.5:
      case '3/2':
        return pxToRem(spacing.S)
      case 2:
        return pxToRem(spacing.M)
      case 2.5:
        return pxToRem(spacing.L)
      case 3:
        return pxToRem(spacing.XL)
      case 4:
        return pxToRem(calcBaseSpace * 4)
      case 8:
        return pxToRem(calcBaseSpace * 8)
    }
  }

  return space(length, options)
}
