'use client'

import { type FC, type ReactNode, useCallback } from 'react'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/client/useCallbackRefCleanupForReact18'
import { FaCircleExclamationIcon } from '../../Icon'
import { Text } from '../../Text'

type Props = {
  id?: string
  errorMessages: ReactNode[]
}

export const ErrorMessages: FC<Props> = ({ id, errorMessages }) => {
  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const ariaNotifyAction = () => {
        const message = node.innerText

        if (message) {
          document.ariaNotify(message)
        }
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
    }, []),
  )

  return (
    <div ref={callbackRef} id={id} className="shr-list-none">
      {errorMessages.map((message, index) => (
        <p key={index}>
          <Text
            className="smarthr-ui-FormControl-errorMessage"
            icon={
              <FaCircleExclamationIcon className="smarthr-ui-FormControl-errorMessage-Icon shr-text-danger" />
            }
          >
            {message}
          </Text>
        </p>
      ))}
    </div>
  )
}
