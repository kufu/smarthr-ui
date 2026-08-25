'use client'

import { FormGroup } from './FormGroup'

import type { ComponentProps, FC } from 'react'

export const FormControl: FC<Omit<ComponentProps<typeof FormGroup>, 'as' | 'disabled'>> = FormGroup
