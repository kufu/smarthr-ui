import React, { HTMLAttributes, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'

type Props = DialogContentInnerProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const Dialog: React.VFC<Props & ElementProps> = ({ children, className = '', ...props }) => {
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  return createPortal(
    <DialogContentInner className={className} {...props}>
      {children}
    </DialogContentInner>,
    element,
  )
}
