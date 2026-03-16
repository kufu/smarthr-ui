import { ActualFormControl } from '../FormControl/FormControl'

import type { ComponentProps, FC, ReactNode } from 'react'

type FormControlType = ComponentProps<typeof ActualFormControl>

export const Fieldset: FC<
  Omit<FormControlType, 'as' | 'label'> & {
    legend: Omit<Exclude<FormControlType['label'], ReactNode>, 'htmlFor'> | ReactNode
  }
> = ({ legend, ...rest }) => <ActualFormControl {...rest} label={legend} as="fieldset" />
