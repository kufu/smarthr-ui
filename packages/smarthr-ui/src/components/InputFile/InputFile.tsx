'use client'

import { forwardRef } from 'react'

import { InputFileMultiplyAppendable, type Props } from './InputFileMultiplyAppendable'

import type { ElementProps } from './types'

export const InputFile = forwardRef<HTMLInputElement, Props & ElementProps>((props, ref) => {
  if (props.multiple && props.multiplyAppendable) {
    return <InputFileMultiplyAppendable {...props} ref={ref} />
  }
})
