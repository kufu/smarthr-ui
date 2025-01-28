import { ReactNode } from 'react'

export type ResponseMessageTypeWithoutProcessing = {
  status: 'success' | 'error'
  text: ReactNode
}
export type ResponseMessageType =
  | ResponseMessageTypeWithoutProcessing
  | {
      status: 'processing'
    }
