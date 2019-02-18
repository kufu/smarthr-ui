import * as React from 'react'

import { IconProps } from '../Icon'

export const Check: React.FC<IconProps> = ({ width = 16, height = 16, fill = '#222' }) => (
  <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 100 100">
    <title>check</title>
    <defs>
      <clipPath id="clip-path-2">
        <path
          d="M100,26.06a6.2,6.2,0,0,1-1.81,4.5L51.48,78.44l-8.77,9a6.1,6.1,0,0,1-8.77,0l-8.78-9L1.81,54.5a6.5,6.5,0,0,1,0-9l8.77-9A5.88,5.88,0,0,1,15,34.66a5.86,5.86,0,0,1,4.38,1.85L38.32,56,80.65,12.57a6.1,6.1,0,0,1,8.77,0l8.77,9A6.19,6.19,0,0,1,100,26.06Z"
          style={{ clipRule: 'evenodd' }}
          fill={fill}
        />
      </clipPath>
    </defs>
    <g id="Check">
      <path
        d="M100,26.06a6.2,6.2,0,0,1-1.81,4.5L51.48,78.44l-8.77,9a6.1,6.1,0,0,1-8.77,0l-8.78-9L1.81,54.5a6.5,6.5,0,0,1,0-9l8.77-9A5.88,5.88,0,0,1,15,34.66a5.86,5.86,0,0,1,4.38,1.85L38.32,56,80.65,12.57a6.1,6.1,0,0,1,8.77,0l8.77,9A6.19,6.19,0,0,1,100,26.06Z"
        style={{ fillRule: 'evenodd' }}
        fill={fill}
      />
      <g style={{ clipPath: 'url(#clip-path-2)' }}>
        <rect x="-20.83" y="-10.12" width="141.67" height="120.24" fill={fill} />
      </g>
    </g>
  </svg>
)
