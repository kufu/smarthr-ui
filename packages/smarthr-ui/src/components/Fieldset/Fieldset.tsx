import { ActualFormControl } from '../FormControl/FormControl'

import type { ComponentProps, FC } from 'react'

export const Fieldset: FC<
  Omit<ComponentProps<typeof ActualFormControl>, 'as' | 'htmlFor' | 'labelId'>
> = (props) => <ActualFormControl {...props} as="fieldset" />
