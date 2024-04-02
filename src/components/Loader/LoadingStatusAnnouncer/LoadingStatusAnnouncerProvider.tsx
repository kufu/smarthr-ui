import React, { FC, ReactNode, useCallback, useRef, useState } from 'react'

import { VisuallyHiddenText } from '../../VisuallyHiddenText'

import {
  CancelFn,
  KickoffFn,
  LoadingStatusAnnouncerContext,
  RejectFn,
  ResolveFn,
} from './LoadingStatusAnnouncerContext'

type TimeoutId = ReturnType<typeof setTimeout>

export type LoadingAnnounceProviderProps = {
  readonly children: ReactNode
}

export const LoadingAnnouncerProvider: FC<LoadingAnnounceProviderProps> = (props) => {
  const { children } = props

  const [message, setMessage] = useState<string | undefined>()

  const timerComplete = useRef<TimeoutId | undefined>()
  const timerError = useRef<TimeoutId | undefined>()

  const kickoff: KickoffFn = useCallback((params) => {
    setMessage(params?.message ?? '処理中')

    return () => {
      setMessage(undefined)
    }
  }, [])

  const cancel: CancelFn = useCallback(() => {
    setMessage(undefined)
  }, [])

  const resolve: ResolveFn = useCallback((params) => {
    setMessage(params?.message ?? '完了')

    timerComplete.current = setTimeout(() => {
      setMessage(undefined)
    }, 1000)

    return () => {
      clearTimeout(timerComplete.current)
    }
  }, [])

  const reject: RejectFn = useCallback((params) => {
    setMessage(params?.message ?? '失敗')

    timerError.current = setTimeout(() => {
      setMessage(undefined)
    }, 1000)

    return () => {
      clearTimeout(timerError.current)
    }
  }, [])

  return (
    <LoadingStatusAnnouncerContext.Provider value={{ kickoff, cancel, resolve, reject }}>
      {children}

      <VisuallyHiddenText role="status">{message}</VisuallyHiddenText>
    </LoadingStatusAnnouncerContext.Provider>
  )
}
