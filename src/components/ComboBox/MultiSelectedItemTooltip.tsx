import React, { FC, PropsWithChildren, ReactNode } from 'react'

import { Tooltip } from '../Tooltip'

type Props = PropsWithChildren<{
  needsTooltip: boolean
  text: ReactNode
  children: ReactNode
}>

export const MultiSelectedItemTooltip: FC<Props> = ({ needsTooltip, text, children }) =>
  needsTooltip ? (
    <Tooltip message={text} multiLine>
      {children}
    </Tooltip>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  )
