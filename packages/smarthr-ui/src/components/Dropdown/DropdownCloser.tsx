import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export const DROPDOWN_CLOSER_CLASS_NAME = 'smarthr-ui-Dropdown-closer'

const classNameGenerator = tv({
  base: DROPDOWN_CLOSER_CLASS_NAME,
})

type Props = PropsWithChildren<ComponentProps<'div'>>

export const DropdownCloser: FC<Props> = ({ children, className, style }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <div role="presentation" className={actualClassName} style={style}>
      {children}
    </div>
  )
}
