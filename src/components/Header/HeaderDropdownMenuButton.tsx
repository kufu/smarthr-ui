import React, { ComponentProps, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownMenuButton } from '../Dropdown'

const headerDropdownMenuButton = tv({
  base: [
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-border-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-bg-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.25 [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-font-normal [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-white',
    // ボタンの余白分だけ微調整
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:last-of-type:-shr-me-0.25',
  ],
})

export const HeaderDropdownMenuButton: React.FC<ComponentProps<typeof DropdownMenuButton>> = ({
  className,
  ...rest
}) => {
  const headerDropdownMenuButtonStyle = useMemo(
    () => headerDropdownMenuButton({ className }),
    [className],
  )

  return <DropdownMenuButton {...rest} className={headerDropdownMenuButtonStyle} />
}
