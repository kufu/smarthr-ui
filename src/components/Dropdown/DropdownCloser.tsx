import React, { ComponentProps, PropsWithChildren, ReactElement, useContext, useMemo } from 'react'
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
    const maxHeightStyle = !controllable && scrollable ? maxHeight : 'initilal'
    return {
      className: closer({ controllable, className }),
      style: {
        maxHeight: maxHeightStyle,
      },
    }
  }, [className, controllable, maxHeight, scrollable])

  let foundFirstElement = false

  return (
    <div {...styleProps}>
      {controllable
        ? // 先頭の内包要素に closer の役割を与える
          React.Children.map(children, (child) => {
            if (foundFirstElement || !React.isValidElement(child)) {
              return child
            }

            foundFirstElement = true

            return React.cloneElement(child as ReactElement, {
              onClick: () => {
                if (child.props.onClick) {
                  child.props.onClick()
                }
                onClickCloser()
              },
            })
          })
        : children}
    </div>
  )
}
