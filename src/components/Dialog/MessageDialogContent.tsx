import React, { HTMLAttributes, useCallback, useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { BaseProps, MessageDialogContentInner } from './MessageDialogContentInner'
import { useId } from '../../hooks/useId'

type Props = Omit<BaseProps, 'titleId'> &
  Pick<DialogContentInnerProps, 'width' | 'top' | 'right' | 'bottom' | 'left' | 'id'>
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialogContent: React.VFC<Props & ElementProps> = ({
  title,
  description,
  closeText,
  className = '',
  ...props
}) => {
  const { DialogContentRoot, onClickClose, active } = useContext(DialogContext)

  const handleClickClose = useCallback(() => {
    if (!active) {
      return
    }
    onClickClose()
  }, [active, onClickClose])
  const titleId = useId()

  return (
    <DialogContentRoot>
      <DialogContentInner
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        isOpen={active}
        className={className}
        {...props}
      >
        <MessageDialogContentInner
          title={title}
          titleId={titleId}
          description={description}
          closeText={closeText}
          onClickClose={handleClickClose}
        />
      </DialogContentInner>
    </DialogContentRoot>
  )
}
