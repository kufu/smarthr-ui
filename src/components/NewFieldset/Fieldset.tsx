import React, { ComponentProps } from 'react'

import { FormGroup } from '../FormGroup'

export const Fieldset: React.FC<ComponentProps<typeof FormGroup>> = (props) => <FormGroup {...props} as="fieldset" />
