'use client'

import React, { ComponentProps, PropsWithChildren, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownContentContext } from './DropdownContent'
import { DropdownContentInnerContext } from './DropdownContentInner'

const closer = tv({
  base: 'smarthr-ui-Dropdown-closer',
  variants: {
    controllable: {
      false: 'shr-flex shr-flex-col',
    },
  },
})

type Props = PropsWithChildren<ComponentProps<'div'>>

export const DropdownCloser: React.FC<Props> = ({ children, className }) => {
  const { onClickCloser, controllable } = useContext(DropdownContentContext)
  const { maxHeight } = useContext(DropdownContentInnerContext)

  const closerStyle = useMemo(() => closer({ controllable, className }), [controllable, className])
  const styleProps = useMemo(() => ({
    maxHeight: controllable ? undefined : maxHeight,
  }), [maxHeight, controllable])

  return (
    <div style={styleProps} className={closerStyle} onClick={onClickCloser} role="presentation">
      {children}
    </div>
  )
}
