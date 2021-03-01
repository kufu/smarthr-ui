import React, { useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { BaseProps, MessageDialogContentInner } from './MessageDialogContentInner'

type Props = BaseProps & Pick<DialogContentInnerProps, 'top' | 'right' | 'bottom' | 'left' | 'id'>

export const MessageDialogContent: React.VFC<Props> = ({
  title,
  description,
  closeText,
  ...props
}) => {
  const { DialogContentRoot, onClickClose, active } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentInner
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        isOpen={active}
        ariaLabel={title}
        {...props}
      >
        <MessageDialogContentInner
          title={title}
          description={description}
          closeText={closeText}
          onClickClose={onClickClose}
        />
      </DialogContentInner>
    </DialogContentRoot>
  )
}
