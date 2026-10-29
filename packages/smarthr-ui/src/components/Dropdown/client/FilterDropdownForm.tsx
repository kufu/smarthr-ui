'use client'

import type { ComponentPropsWithRef, FC, FormEvent } from 'react'

const ON_SUBMIT = (e: FormEvent) => {
  e.preventDefault()
}

type Props = Omit<ComponentPropsWithRef<'form'>, 'onSubmit'>

export const FilterDropdownForm: FC<Props> = ({ children, ...rest }) => (
  <form {...rest} onSubmit={ON_SUBMIT}>
    {children}
  </form>
)
