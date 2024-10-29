import { ComponentPropsWithoutRef } from 'react'

export type PickerProps<Props> = Props &
  Omit<ComponentPropsWithoutRef<'input'>, keyof Props | 'type'>
