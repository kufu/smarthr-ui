import React, { ComponentProps } from 'react'

import { ActualFormControl } from '../FormControl'

export const Fieldset: React.FC<ComponentProps<typeof ActualFormControl>> = (props) => (
  <ActualFormControl {...props} as="fieldset" />
)
