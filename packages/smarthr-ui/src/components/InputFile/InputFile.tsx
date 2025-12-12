'use client'

import { forwardRef } from 'react'

import { InputFileMultiplyAppendable } from './InputFileMultiplyAppendable'
import { InputFileNative } from './InputFileNative'

import type { Props } from './types'

export const InputFile = forwardRef<HTMLInputElement, Props>((props, ref) => {
  if (props.multiple && props.multiplyAppendable) {
    return <InputFileMultiplyAppendable {...props} ref={ref} />
  }
  return <InputFileNative {...props} ref={ref} />
})
