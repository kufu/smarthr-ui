import { type ComponentProps, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownMenuButton } from '../Dropdown'

const classNameGenerator = tv({
  base: [
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-border-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-bg-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.25 [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-font-normal [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-white',
    // ボタンの余白分だけ微調整
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:last-of-type:-shr-me-0.25',
  ],
})

export const HeaderDropdownMenuButton: FC<ComponentProps<typeof DropdownMenuButton>> = ({
  className,
  ...rest
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return <DropdownMenuButton {...rest} className={actualClassName} />
}
