import { useTheme } from '../hooks/useTheme'
import { AbstractSize, CharRelativeSize } from '../themes/createSpacing'

export const useSpacing = (size: CharRelativeSize | AbstractSize) => {
  const { spacing, spacingByChar } = useTheme()

  if (typeof size === 'number') {
    return spacingByChar(size)
  } else if (typeof size === 'string') {
    return spacing[size]
  } else {
    // not going through
    return '0'
  }
}
