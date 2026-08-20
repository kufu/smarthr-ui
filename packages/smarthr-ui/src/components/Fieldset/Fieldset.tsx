import { useRef } from 'react'

import { ActualFormControl } from '../FormControl'

import type { ComponentProps, FC, ReactNode } from 'react'

type FormControlType = ComponentProps<typeof ActualFormControl>

export const Fieldset: FC<
  Omit<FormControlType, 'as' | 'label' | 'inputWrapperRef'> & {
    legend: Omit<Exclude<FormControlType['label'], ReactNode>, 'htmlFor'> | ReactNode
  }
> = ({ legend, ...rest }) => {
  const inputWrapperRef = useRef<HTMLDivElement>(null)

  return (
    <ActualFormControl {...rest} label={legend} as="fieldset" inputWrapperRef={inputWrapperRef} />
  )
}
