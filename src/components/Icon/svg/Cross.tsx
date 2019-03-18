import * as React from 'react'

import { InjectedProps, withTheme } from '../../../hocs/withTheme'
import { IconProps } from '../Icon'

const CrossIcon: React.FC<IconProps & InjectedProps> = ({
  width = 16,
  height = 16,
  fill,
  theme,
}) => (
  <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 100 100">
    <title>cross</title>
    <g id="Cross">
      <path
        d="M60.61,50,97.8,12.8A7.5,7.5,0,1,0,87.2,2.2L50,39.39,12.8,2.2A7.5,7.5,0,0,0,2.2,12.8L39.39,50,2.2,87.2A7.5,7.5,0,1,0,12.8,97.8L50,60.61,87.2,97.8A7.5,7.5,0,0,0,97.8,87.2Z"
        fill={fill ? fill : theme.palette.Mono_P40}
      />
    </g>
  </svg>
)

export const Cross = withTheme(CrossIcon)
