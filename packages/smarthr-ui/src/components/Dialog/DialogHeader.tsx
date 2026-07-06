'use client'

import { type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../hooks/useEnvironment'
import { Cluster } from '../Layout'

const classNameGenerator = tv({
  base: ['smarthr-ui-Dialog-titleArea', 'shr-border-b-shorthand shr-flex-none shr-px-1.5 shr-py-1'],
  variants: {
    mobile: {
      true: 'shr-p-1',
      false: '',
    },
  },
})

type Props = PropsWithChildren<{ className?: string }>

export const DialogHeader: FC<Props> = ({ children, className }) => {
  const { mobile } = useEnvironment()

  const actualClassName = useMemo(
    () => classNameGenerator({ mobile, className }),
    [mobile, className],
  )

  return (
    <Cluster justify="space-between" align="center" className={actualClassName}>
      {children}
    </Cluster>
  )
}
