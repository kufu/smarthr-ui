import React, { ReactNode, VFC } from 'react'

import { Tooltip } from '../Tooltip'

type Props = {
  needsTooltip: boolean
  text: string
  children: ReactNode
}

export const MultiSelectedItemTooltip: VFC<Props> = ({ needsTooltip, text, children }) => {
  return needsTooltip ? (
    <Tooltip message={text} multiLine>
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  )
}
