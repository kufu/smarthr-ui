'use client'

import { type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

const classNameGenerator = tv({
  base: ['smarthr-ui-Dialog-titleArea', 'shr-border-b-shorthand shr-flex-none shr-px-1.5 shr-py-1'],
})

type Props = PropsWithChildren<{ className?: string }>

export const DialogHeader: FC<Props> = ({ children, className }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Cluster justify="space-between" align="center" className={actualClassName}>
      {children}
    </Cluster>
  )
}
