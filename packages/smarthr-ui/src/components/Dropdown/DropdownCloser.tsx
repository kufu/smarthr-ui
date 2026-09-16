import { type ComponentProps, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export const DROPDOWN_CLOSER_CLASS_NAME = 'smarthr-ui-Dropdown-closer'

const classNameGenerator = tv({
  base: DROPDOWN_CLOSER_CLASS_NAME,
})

// HINT: onClickは念のためomitしているが、必要に応じて利用可能にすることを検討する
type Props = PropsWithChildren<Omit<ComponentProps<'div'>, 'role' | 'onClick'>>

export const DropdownCloser: FC<Props> = ({ className, style, children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <div {...rest} role="presentation" className={actualClassName} style={style}>
      {children}
    </div>
  )
}
