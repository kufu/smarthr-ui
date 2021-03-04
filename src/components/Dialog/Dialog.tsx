import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'

type Props = DialogContentInnerProps

export const Dialog: React.VFC<Props> = ({ children, ...props }) => {
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  return createPortal(<DialogContentInner {...props}>{children}</DialogContentInner>, element)
}
