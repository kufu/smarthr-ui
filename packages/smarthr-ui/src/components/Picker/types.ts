import type { ComponentPropsWithRef } from 'react'

export type PickerProps<Props> = Props & Omit<ComponentPropsWithRef<'input'>, keyof Props | 'type'>
