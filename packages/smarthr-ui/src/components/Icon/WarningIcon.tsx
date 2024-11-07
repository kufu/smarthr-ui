import React from 'react'
import { IconBase } from 'react-icons'

import { generateIcon } from './generateIcon'

export const WarningIcon = /*#__PURE__*/ generateIcon((props) => (
  <IconBase {...props} viewBox="0 0 16 16">
    <path
      d="m8.863 1.745 6.75 11.5a.998.998 0 0 1-.862 1.505H1.25c-.358 0-.69-.193-.868-.502a1.005 1.005 0 0 1 .005-1.003l6.75-11.5a.998.998 0 0 1 1.725 0Z"
      className="smarthr-ui-WarningIcon-wrapper shr-fill-warning-yellow shr-stroke-black shr-stroke-0.5"
    />
    <path
      className="smarthr-ui-WarningIcon-mark shr-fill-black"
      d="M8 5a.748.748 0 0 0-.75.75v3.5c0 .416.334.75.75.75s.75-.334.75-.75v-3.5A.748.748 0 0 0 8 5Zm1 7a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"
    />
  </IconBase>
))
