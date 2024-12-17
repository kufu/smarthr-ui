import React, { PropsWithChildren, memo } from 'react'

export const Translate = memo<PropsWithChildren>(({ children }) => (
  <span data-wovn-enable="true">{children}</span>
))
