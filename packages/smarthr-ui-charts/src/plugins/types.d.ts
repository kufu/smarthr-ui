import type { KeyboardNavigationOptions } from './keyboardNavigationPlugin'
import type { ChartType } from 'chart.js'

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface PluginOptionsByType<TType extends ChartType> {
    keyboardNavigation?: KeyboardNavigationOptions
  }
}
