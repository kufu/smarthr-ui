'use client'

import type { FormEvent, PropsWithChildren } from 'react'

const ON_SUBMIT = (e: FormEvent) => {
  e.preventDefault()
}

export const FilterDropdownForm = ({ children }: PropsWithChildren) => (
  <form onSubmit={ON_SUBMIT}>{children}</form>
)
