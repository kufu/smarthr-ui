import React, { HTMLAttributes, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'

type Props = DialogContentInnerProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Dialog: React.VFC<Props & ElementProps> = ({
  children,
  className = '',
  portalParent = document.body,
  ...props
}) => {
  const portalContainer = useRef(document.createElement('div')).current

  useEffect(() => {
    if (!portalParent) {
      return
    }

    portalParent.appendChild(portalContainer)

    return () => {
      portalParent.removeChild(portalContainer)
    }
  }, [portalContainer, portalParent])

  return createPortal(
    <DialogContentInner className={className} {...props}>
      {children}
    </DialogContentInner>,
    portalContainer,
  )
}
