import type { KeyboardNavigationOptions } from './keyboardNavigationPlugin'
import type { RoundedProgressOptions } from './roundedProgressPlugin'
import type { ChartType } from 'chart.js'

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface PluginOptionsByType<_TType extends ChartType> {
    keyboardNavigation?: KeyboardNavigationOptions
    roundedProgress?: RoundedProgressOptions
  }
}
