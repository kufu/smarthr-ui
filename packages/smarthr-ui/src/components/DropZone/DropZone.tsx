'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type DragEvent,
  type PropsWithChildren,
  forwardRef,
} from 'react'

import { DropZoneBase } from './DropZoneBase'

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
} & Omit<ComponentPropsWithRef<'div'>, 'children' | 'multiple' | 'onSelectFiles' | 'files' | 'accept' | 'name' | 'disabled' | 'error'>

type Props = NormalModeProps

export const DropZone = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <DropZoneBase {...props} ref={ref} />
))
