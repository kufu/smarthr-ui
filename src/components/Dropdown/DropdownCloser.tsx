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
  const { onClickCloser, controllable, scrollable } = useContext(DropdownContentContext)
  const { maxHeight } = useContext(DropdownContentInnerContext)

  const styleProps = useMemo(() => {
    const maxHeightStyle = !controllable && scrollable ? maxHeight : undefined
    return {
      className: closer({ controllable, className }),
      style: {
        maxHeight: maxHeightStyle,
      },
    }
  }, [className, controllable, maxHeight, scrollable])

  return (
    <div {...styleProps} onClick={onClickCloser}>
      {children}
    </div>
  )
}
