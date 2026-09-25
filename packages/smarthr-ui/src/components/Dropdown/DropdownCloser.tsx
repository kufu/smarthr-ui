import type { ComponentProps, ElementType, FC, PropsWithChildren } from 'react'

export const DROPDOWN_CLOSER_CLASS_NAME = 'smarthr-ui-Dropdown-closer'

// HINT: onClickは念のためomitしているが、必要に応じて利用可能にすることを検討する
type Props = PropsWithChildren<
  Omit<ComponentProps<'div'>, 'onClick'> & {
    as?: ElementType
  }
>

export const DropdownCloser: FC<Props> = ({
  as: Component = 'div',
  className,
  children,
  ...rest
}) => (
  <Component {...rest} className={`${DROPDOWN_CLOSER_CLASS_NAME} ${className || ''}`}>
    {children}
  </Component>
)
