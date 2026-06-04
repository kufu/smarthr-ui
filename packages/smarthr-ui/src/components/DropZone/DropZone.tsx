'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type DragEvent,
  type PropsWithChildren,
  forwardRef,
} from 'react'

import { DropZoneBase } from './DropZoneBase'
import { DropZoneMultiplyAppendable } from './DropZoneMultiplyAppendable'

type CommonProps = PropsWithChildren<{
  accept?: string
  name?: string
  disabled?: boolean
  error?: boolean
  selectButtonLabel?: string
}>

type NormalModeProps = CommonProps & {
  multiple?: boolean
  onSelectFiles: (
    e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>,
    files: FileList | null,
  ) => void
  files?: never
} & Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'multiple' | 'onSelectFiles' | 'files' | 'accept' | 'name' | 'disabled' | 'error'
  >

type AppendableModeProps = CommonProps & {
  multiple: { appendable: true }
  files: File[]
  onSelectFiles: (e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>, files: File[]) => void
} & Omit<
    ComponentPropsWithRef<'div'>,
    'children' | 'multiple' | 'onSelectFiles' | 'files' | 'accept' | 'name' | 'disabled' | 'error'
  >

type Props = NormalModeProps | AppendableModeProps

function isAppendableMode(props: Props): props is AppendableModeProps {
  return typeof props.multiple === 'object' && !!props.multiple.appendable
}

export const DropZone = forwardRef<HTMLInputElement, Props>((props, ref) => {
  if (isAppendableMode(props)) {
    const { multiple: _m, ...rest } = props
    return <DropZoneMultiplyAppendable {...rest} ref={ref} />
  }

  const { files: _f, ...rest } = props
  return <DropZoneBase {...rest} ref={ref} />
})
