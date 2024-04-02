import { createContext } from 'react'

export type KickoffFnParams = {
  readonly message?: string
}

export type KickoffFn = (params?: KickoffFnParams) => void

export type ResolveFnParams = {
  readonly message?: string
}

export type CancelFn = () => void

export type ResolveFn = (params?: ResolveFnParams) => void

export type RejectFnParams = {
  readonly message?: string
}

export type RejectFn = (params?: RejectFnParams) => void

function noop() {
  console.warn(
    'LoadingStatusAnnouncerContext.Provider requires an `announce` callback function ' +
      'which defines the behavior of announcing a loading message. However, ' +
      'no provider was found in the component tree.',
  )
}

export type LoadingStatusAnnouncerContextValue = {
  readonly kickoff: KickoffFn
  readonly cancel: CancelFn
  readonly resolve: ResolveFn
  readonly reject: RejectFn
}

export const LoadingStatusAnnouncerContext = createContext<LoadingStatusAnnouncerContextValue>({
  kickoff: noop,
  cancel: noop,
  resolve: noop,
  reject: noop,
})
