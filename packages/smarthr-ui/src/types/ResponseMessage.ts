import { ReactNode } from 'react'

export type ResponseMessageType =
  | {
      status: 'success' | 'error'
      text: ReactNode
    }
  | {
      status: 'processing'
    }
