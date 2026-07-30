'use client'

import { type ComponentProps, type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownContentContext } from './DropdownContent'
import { DropdownContentInnerContext } from './DropdownContentInner'

const classNameGenerator = tv({
  base: 'smarthr-ui-Dropdown-closer',
  variants: {
    controllable: {
      false: 'shr-flex shr-flex-col',
    },
  },
})

type Props = PropsWithChildren<ComponentProps<'div'>>

export const DropdownCloser: FC<Props> = ({ children, className }) => {
  const { handleDelegateClickCloser, controllable } = useContext(DropdownContentContext)
  const { maxHeight } = useContext(DropdownContentInnerContext)

  const actualClassName = useMemo(
    () => classNameGenerator({ controllable, className }),
    [controllable, className],
  )

  return (
    <div
      role="presentation"
      onClick={handleDelegateClickCloser}
      className={actualClassName}
      style={{
        maxHeight: controllable ? undefined : maxHeight,
      }}
    >
      {children}
    </div>
  )
}
