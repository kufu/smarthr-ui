import { useMemo } from 'react'
import { tv } from 'tailwind-variants'

const dialogContentInner = tv({
  slots: {
    titleArea: ['smarthr-ui-Dialog-titleArea', 'shr-border-b-shorthand shr-px-1.5 shr-py-1'],
    body: ['smarthr-ui-Dialog-body', 'shr-overflow-auto shr-p-1.5'],
    actionArea: ['smarthr-ui-Dialog-actionArea', 'shr-border-t-shorthand shr-px-1.5 shr-py-1'],
    buttonArea: ['smarthr-ui-Dialog-buttonArea', 'shr-ms-auto'],
    message: 'shr-text-right',
  },
})

export const useDialoginnerStyle = (offsetHeight: number) =>
  useMemo(() => {
    const { titleArea, body, actionArea, buttonArea, message } = dialogContentInner()
    return {
      titleAreaStyle: titleArea(),
      bodyStyleProps: {
        className: body(),
        style: {
          maxHeight: `calc(100svh - ${offsetHeight}px)`,
        },
      },
      actionAreaStyle: actionArea(),
      buttonAreaStyle: buttonArea(),
      messageStyle: message(),
    }
  }, [offsetHeight])
