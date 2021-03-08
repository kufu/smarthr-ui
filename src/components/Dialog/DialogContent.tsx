import React, { createContext, useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'

type DialogContentContextType = {
  onClickClose: () => void
}

export const DialogContentContext = createContext<DialogContentContextType>({
  onClickClose: () => {
    /* noop */
  },
})

type Props = Pick<
  DialogContentInnerProps,
  'top' | 'right' | 'bottom' | 'left' | 'id' | 'ariaLabel' | 'ariaLabelledby' | 'children'
>

export const DialogContent: React.VFC<Props> = ({ children, ...props }) => {
  const { DialogContentRoot, onClickClose, active } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentContext.Provider value={{ onClickClose }}>
        <DialogContentInner
          isOpen={active}
          onClickOverlay={onClickClose}
          onPressEscape={onClickClose}
          {...props}
        >
          {children}
        </DialogContentInner>
      </DialogContentContext.Provider>
    </DialogContentRoot>
  )
}
