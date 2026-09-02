'use client'

import { memo, useCallback } from 'react'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { useLatest } from '../../../hooks/useLatest'
import {
  FaCircleCheckIcon,
  FaCircleExclamationIcon,
  FaCircleInfoIcon,
  FaRotateIcon,
  FaTriangleExclamationIcon,
  WarningIcon,
} from '../../Icon'
import { Text } from '../../Text'

import type { NotificationBarProps } from '../NotificationBar'

const ABSTRACT_ICON_MAPPER = {
  info: FaCircleInfoIcon,
  success: FaCircleCheckIcon,
  error: FaCircleExclamationIcon,
  sync: FaRotateIcon,
}
const ICON_MAPPER = {
  normal: {
    ...ABSTRACT_ICON_MAPPER,
    warning: WarningIcon,
  },
  bold: {
    ...ABSTRACT_ICON_MAPPER,
    warning: FaTriangleExclamationIcon,
  },
} as const

const ROLE_STATUS_TYPE_REGEX = /^(info|sync|success)$/

export const MessageArea = memo<
  Pick<NotificationBarProps, 'children' | 'bold' | 'type' | 'role'> & {
    classNames: { messageArea: string; icon: string }
  }
>(({ children, bold, type, role, classNames }) => {
  const Icon = ICON_MAPPER[bold ? 'bold' : 'normal'][type]

  const latest = useLatest({ role, type })

  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback(
      (node: HTMLElement | null) => {
        if (!node) {
          return
        }

        const ariaNotifyAction = () => {
          const message = node.innerText || ''

          if (!message) {
            return
          }

          const actualRole =
            latest.role || (ROLE_STATUS_TYPE_REGEX.test(latest.type) ? 'status' : 'alert')

          document.ariaNotify(message, {
            priority: actualRole === 'alert' ? 'high' : 'normal',
          })
        }

        ariaNotifyAction()

        const observer = new MutationObserver(ariaNotifyAction)
        observer.observe(node, {
          childList: true,
          subtree: true,
          characterData: true,
        })

        return () => {
          observer.disconnect()
        }
      },
      [latest],
    ),
  )

  return (
    <Text
      as="div"
      ref={callbackRef}
      className={classNames.messageArea}
      icon={{
        prefix: <Icon className={classNames.icon} />,
        gap: 0.5,
      }}
    >
      {children}
    </Text>
  )
})
