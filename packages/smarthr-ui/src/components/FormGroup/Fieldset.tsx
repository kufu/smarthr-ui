import { FormGroup } from './FormGroup'

import type { ComponentProps, FC, ReactNode } from 'react'

type FormControlType = ComponentProps<typeof FormGroup>

export const Fieldset: FC<
  Omit<FormControlType, 'as' | 'label'> & {
    legend: Omit<Exclude<FormControlType['label'], ReactNode>, 'htmlFor'> | ReactNode
  }
> = ({ legend, ...rest }) => <FormGroup {...rest} label={legend} as="fieldset" />
