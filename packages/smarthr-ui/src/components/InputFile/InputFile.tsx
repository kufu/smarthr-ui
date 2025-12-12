'use client'

import { forwardRef } from 'react'

import { InputFileMultiplyAppendable } from './InputFileMultiplyAppendable'
import { InputFileNative } from './InputFileNative'

import type { Props } from './types'

export const InputFile = forwardRef<HTMLInputElement, Props>(({ multiple, ...rest }, ref) => {
  if (typeof multiple === 'object' && multiple.appendable) {
    return <InputFileMultiplyAppendable {...rest} ref={ref} />
  }

  return <InputFileNative {...rest} multiple={multiple as boolean | undefined} ref={ref} />
})
