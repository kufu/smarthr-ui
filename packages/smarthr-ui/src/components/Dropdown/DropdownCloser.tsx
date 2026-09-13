import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

const classNameGenerator = tv({
  base: 'smarthr-ui-Dropdown-closer',
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
