import React, { ComponentProps } from 'react'

import { ActualFormControl } from '../FormControl/FormControl'

export const Fieldset: React.FC<
  Omit<ComponentProps<typeof ActualFormControl>, 'as' | 'htmlFor' | 'labelId'>
> = (props) => <ActualFormControl {...props} as="fieldset" />
