import React, { ComponentProps, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownMenuButton } from '../Dropdown'

const headerDropdownMenuButton = tv({
  base: [
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-border-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-bg-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.25 [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-font-normal',
    // ボタンの余白分だけ微調整
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:last-of-type:-shr-me-0.25',
  ],
  variants: {
    textColor: {
      TEXT_WHITE: '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-white',
      TEXT_BLACK: '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-black',
      TEXT_GREY: '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-grey',
      TEXT_DISABLED: '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-disabled',
      TEXT_LINK: '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-link',
      inherit: '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-inherit',
    },
  },
})

export const HeaderDropdownMenuButton: React.FC<
  ComponentProps<typeof DropdownMenuButton> & {
    textColor?:
      | 'inherit'
      | 'TEXT_BLACK'
      | 'TEXT_WHITE'
      | 'TEXT_GREY'
      | 'TEXT_DISABLED'
      | 'TEXT_LINK'
  }
> = ({ className, textColor = 'TEXT_WHITE', ...rest }) => {
  const headerDropdownMenuButtonStyle = useMemo(
    () => headerDropdownMenuButton({ className, textColor }),
    [className, textColor],
  )

  return <DropdownMenuButton {...rest} className={headerDropdownMenuButtonStyle} />
}
