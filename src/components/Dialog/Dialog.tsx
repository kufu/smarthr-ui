import React, { HTMLAttributes, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'

type Props = DialogContentInnerProps & { portalParent?: HTMLElement }
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Dialog: React.VFC<Props & ElementProps> = ({
  children,
  className = '',
  portalParent,
  ...props
}) => {
  const portalContainer = useRef(document.createElement('div')).current

  useEffect(() => {
    // SSR を考慮し、useEffect 内で初期値 document.body を指定
    const pp = portalParent || document.body
    pp.appendChild(portalContainer)
    return () => {
      pp.removeChild(portalContainer)
    }
  }, [portalContainer, portalParent])

  return createPortal(
    <DialogContentInner className={className} {...props}>
      {children}
    </DialogContentInner>,
    portalContainer,
  )
}
