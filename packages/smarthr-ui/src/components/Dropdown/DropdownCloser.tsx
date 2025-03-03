'use client'

import React, {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  memo,
  useContext,
  useMemo,
} from 'react'
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
  const { onClickCloser, controllable } = useContext(DropdownContentContext)
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
    // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
    <ActualDropdownCloser onClick={onClickCloser} className={actualClassName} style={style}>
      {children}
    </ActualDropdownCloser>
  )
}

const ActualDropdownCloser =
  memo <
  PropsWithChildren<{ className: string; style: { [key: string]: string }; onClick: () => void }>(
    ({ className, style, onClick, children }) => (
      // eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation
      <div role="presentation" onClick={onClick} className={className} style={style}>
        {children}
      </div>
    ),
  )
