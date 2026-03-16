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
  const { onClickCloser: onDelegateClick, controllable } = useContext(DropdownContentContext)
  const { maxHeight } = useContext(DropdownContentInnerContext)

  const actualClassName = useMemo(
    () => classNameGenerator({ controllable, className }),
    [controllable, className],
  )
  const style = useMemo(
    () => ({
      maxHeight: controllable ? undefined : maxHeight,
    }),
    [maxHeight, controllable],
  )

  return (
    <div role="presentation" onClick={onDelegateClick} className={actualClassName} style={style}>
      {children}
    </div>
  )
}
