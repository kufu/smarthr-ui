import { type RefObject, useEffect, useMemo, useRef } from 'react'

import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'

import type { CommonProps } from './type'

type Props = Pick<
  CommonProps,
  'helpMessage' | 'exampleMessage' | 'errorMessages' | 'supplementaryMessage'
> & {
  wrapperRef: RefObject<HTMLDivElement>
  /** 各メッセージのidを組み立てる接頭辞。labelのhtmlForと同じ値 */
  htmlFor: string
}

export const useDescribedByIds = ({
  wrapperRef,
  htmlFor,
  errorMessages,
  helpMessage,
  exampleMessage,
  supplementaryMessage,
}: Props) => {
  // HINT: memo化している箇所がないため毎回計算している
  const actualErrorMessages = errorMessages
    ? Array.isArray(errorMessages)
      ? errorMessages
      : [errorMessages]
    : []

  const helpMessageId = helpMessage ? `${htmlFor}_helpMessage` : undefined
  const exampleMessageId = exampleMessage ? `${htmlFor}_exampleMessage` : undefined
  const supplementaryMessageId = supplementaryMessage
    ? `${htmlFor}_supplementaryMessage`
    : undefined
  const visibleErrorMessages = actualErrorMessages.length > 0
  const errorMessagesId = visibleErrorMessages ? `${htmlFor}_errorMessages` : undefined

  const describedbyIds = useMemo(() => {
    const temp: string[] = []

    if (helpMessageId) {
      temp.push(helpMessageId)
    }
    if (exampleMessageId) {
      temp.push(exampleMessageId)
    }
    if (supplementaryMessageId) {
      temp.push(supplementaryMessageId)
    }
    if (errorMessagesId) {
      temp.push(errorMessagesId)
    }

    return temp.join(' ')
  }, [helpMessageId, exampleMessageId, supplementaryMessageId, errorMessagesId])

  const managedDescribedbyIdsRef = useRef<string[]>([])

  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }

    const input = wrapperRef.current.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (!input) {
      return
    }

    const ariaDescribedBy = input.getAttribute('aria-describedby') || ''
    const currentTokens = ariaDescribedBy ? ariaDescribedBy.split(' ') : []
    // HINT: 自分が過去に付与したid以外（=外部由来のid）だけを残す
    const externalTokens = currentTokens.filter(
      (token) => !managedDescribedbyIdsRef.current.includes(token),
    )
    const describedbyIdTokens = describedbyIds ? describedbyIds.split(' ') : []
    const nextValue = [...externalTokens, ...describedbyIdTokens].join(' ')

    if (nextValue !== ariaDescribedBy) {
      if (nextValue) {
        input.setAttribute('aria-describedby', nextValue)
      } else {
        input.removeAttribute('aria-describedby')
      }
    }

    managedDescribedbyIdsRef.current = describedbyIdTokens
  }, [describedbyIds, wrapperRef])

  return {
    errorMessages: actualErrorMessages,
    visibleErrorMessages,
    helpMessageId,
    exampleMessageId,
    supplementaryMessageId,
    errorMessagesId,
    describedbyIds,
  }
}
