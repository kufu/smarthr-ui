import { ReactNode, useMemo } from 'react'

export type ResponseStatusWithoutProcessing = {
  status: 'success' | 'error'
  text: ReactNode
}

export type ResponseStatus =
  | ResponseStatusWithoutProcessing
  | {
      status: 'processing'
    }

export const useResponseStatus = (responseMessage: ResponseStatus | undefined) => {
  const calculated = useMemo(() => {
    if (!responseMessage) {
      return {
        isProcessing: false,
        status: undefined,
        message: '',
      }
    }

    if (responseMessage.status === 'processing') {
      return {
        isProcessing: true,
        status: undefined,
        message: '',
      }
    }

    return {
      isProcessing: false,
      // HINT: statusがprocessingではない === success or errorであることが確定する
      // success or error の場合、text属性も必ず存在する
      status: responseMessage.status,
      message: responseMessage.text,
    }
  }, [responseMessage])

  return calculated
}
