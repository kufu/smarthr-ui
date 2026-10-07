import type { SHRComponentPropsWithRef } from '../../types'
import type { ElementType, FC } from 'react'

export const DROPDOWN_CLOSER_CLASS_NAME = 'smarthr-ui-Dropdown-closer'

type Props = SHRComponentPropsWithRef<
  'div',
  {
    as?: ElementType
  },
  {
    // HINT: onClickは念のためomitしているが、必要に応じて利用可能にすることを検討する
    omit: 'onClick'
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
