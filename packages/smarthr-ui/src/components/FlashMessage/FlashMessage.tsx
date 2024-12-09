'use client'

import React, { ComponentPropsWithoutRef, FC, ReactNode, useEffect, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Button } from '../Button'
import { FaXmarkIcon } from '../Icon'
import { ResponseMessage } from '../ResponseMessage'

export const messageTypes = ['success', 'info', 'warning', 'error'] as const
export const roles = ['alert', 'status'] as const

export type Props = {
  /** true のときに FlashMessage を表示する */
  visible: boolean
  /** 表示するアイコンのタイプ */
  type: (typeof messageTypes)[number]
  /** メッセージの内容 */
  text: ReactNode
  /** コンポーネントに適用する role 属性 */
  role?: (typeof roles)[number]
  /** 閉じるボタンを押下、または表示してから8秒後に発火するコールバック関数 */
  onClose: () => void
  /** FlashMessage が表示されてから一定時間後に自動で閉じるかどうか */
  autoClose?: boolean
} & VariantProps<typeof flashMessage>

type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

const REMOVE_DELAY = 8000

const flashMessage = tv({
  slots: {
    wrapper: [
      'smarthr-ui-FlashMessage',
      'shr-border-shorthand shr-fixed shr-bottom-0.5 shr-left-0.5 shr-z-flash-message shr-flex shr-items-center shr-gap-0.5 shr-rounded-m shr-bg-white shr-p-1 shr-shadow-layer-4',
      '[&_.smarthr-ui-Icon-withText]:-shr-my-0.25 [&_.smarthr-ui-Icon-withText]:shr-grow',
      /* Icon + margin + 8文字 + margin + Button(border + padding + fontSize) */
      'shr-min-w-[calc(1em+theme(spacing[0.5])+8em+theme(spacing[0.5])+(theme(borderWidth.DEFAULT)*2)+(theme(spacing[0.5])*2)+theme(fontSize.sm))]',
    ],
    responseMessage: ['smarthr-ui-FlashMessage-icon', ''],
    closeButton: ['smarthr-ui-FlashMessage-button', '-shr-my-0.5 -shr-mr-0.5'],
  },
  variants: {
    animation: {
      bounce: {
        wrapper: [
          'shr-animate-[flash-message-bounce_1s_0s_both]',
          'motion-reduce:shr-animate-none',
        ],
      },
      none: {},
    },
  },
})

/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
export const FlashMessage: FC<Props & ElementProps> = ({
  visible,
  type,
  text,
  animation = 'bounce',
  role = 'alert',
  className,
  onClose,
  autoClose = true,
  ...rest
}) => {
  useEffect(() => {
    if (!visible || !autoClose) {
      return
    }
    const timerId = setTimeout(onClose, REMOVE_DELAY)

    return () => {
      clearTimeout(timerId)
    }
  }, [autoClose, onClose, visible])

  const { wrapperStyle, responseMessageStyle, closeButtonStyle } = useMemo(() => {
    const { wrapper, responseMessage, closeButton } = flashMessage()
    return {
      wrapperStyle: wrapper({ animation, className }),
      responseMessageStyle: responseMessage(),
      closeButtonStyle: closeButton(),
    }
  }, [animation, className])

  if (!visible) return null

  return (
    <div {...rest} className={wrapperStyle} role={role}>
      <ResponseMessage type={type} iconGap={0.5} className={responseMessageStyle}>
        {text}
      </ResponseMessage>
      <Button className={closeButtonStyle} onClick={onClose} size="s" square>
        <FaXmarkIcon alt="閉じる" />
      </Button>
    </div>
  )
}
