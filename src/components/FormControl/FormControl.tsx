import React, { ComponentProps } from 'react'

import { FormGroup } from '../FormGroup'

type Props = Omit<ComponentProps<typeof FormGroup>, 'as' | 'dangerouslyTitleHidden'>

export const FormControl: React.FC<Props> = FormGroup
// 一部スタイリングが内部的に FormGroup という名前に依存しているため置き換え
FormControl.displayName = 'FormGroup'
