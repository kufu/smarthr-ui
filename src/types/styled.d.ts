import 'styled-components'

import { CreatedTheme } from '../themes/createTheme'

declare module 'styled-components' {
  export interface DefaultTheme extends CreatedTheme {}
}
