import type { DoughnutSegmentDividerOptions } from './doughnutSegmentDividerPlugin'
import type { KeyboardNavigationOptions } from './keyboardNavigationPlugin'
import type { RoundedProgressOptions } from './roundedProgressPlugin'
import type { ChartType } from 'chart.js'

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface PluginOptionsByType<_TType extends ChartType> {
    doughnutSegmentDivider?: DoughnutSegmentDividerOptions
    keyboardNavigation?: KeyboardNavigationOptions
    // chart.js はプラグインオプションが false のときそのプラグインを実行しないため、
    // 丸端をやめる指定として false を受け取れるようにする。
    roundedProgress?: RoundedProgressOptions | false
  }
}
