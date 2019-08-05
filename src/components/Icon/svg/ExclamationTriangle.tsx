import * as React from 'react'

import { InjectedProps, withTheme } from '../../../hocs/withTheme'
import { IconProps } from '../Icon'

const ExclamationTriangleIcon: React.FC<IconProps & InjectedProps> = ({
  width = 16,
  height = 16,
  fill,
  theme,
}) => (
  <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 100 100">
    <title>exclamation triangle</title>
    <g id="Exclamation_Triangle">
      <path
        d="M98.72,80.6l-40-70.79a9.74,9.74,0,0,0-16.93,0L1.3,80.57A9.73,9.73,0,0,0,9.75,95.13h80.5A9.73,9.73,0,0,0,98.72,80.6ZM45,36.33a5,5,0,0,1,10,0V58.67a5,5,0,0,1-10,0Zm5.11,43.82a5.62,5.62,0,1,1,5.61-5.62A5.62,5.62,0,0,1,50.11,80.15Z"
        fill={fill ? fill : theme.palette.TextGrey}
        style={{ fillRule: 'evenodd' }}
      />
    </g>
  </svg>
)

export const ExclamationTriangle = withTheme(ExclamationTriangleIcon)
