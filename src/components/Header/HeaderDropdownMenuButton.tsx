import React, { ComponentPropsWithRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownMenuButton } from '../Dropdown'

const headerDropdownMenuButton = tv({
  base: [
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:shr-ps-0.25] [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-border-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-bg-transparent [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-pe-0.25 [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-ps-0.25 [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-font-normal [&>.smarthr-ui-DropdownMenuButton-trigger]:shr-text-white',
    // ボタンの余白分だけ微調整
    '[&>.smarthr-ui-DropdownMenuButton-trigger]:last-of-type:-shr-me-0.25',
  ],
})

export const HeaderDropdownMenuButton = ({
  className,
  ...rest
}: ComponentPropsWithRef<typeof DropdownMenuButton>) => {
  const headerDropdownMenuButtonStyle = useMemo(
    () => headerDropdownMenuButton({ className }),
    [className],
  )

  return <DropdownMenuButton {...rest} className={headerDropdownMenuButtonStyle} />
}

// export const HeaderDropdownMenuButton = styled(DropdownMenuButton)(() => {
//   const { color, space } = useTheme()
//   return css`
//     > .smarthr-ui-DropdownMenuButton-trigger {
//       border-color: transparent;
//       background-color: transparent;
//       padding-inline: ${space(0.25)};
//       color: ${color.TEXT_WHITE};
//       font-weight: normal;

//       &:last-of-type {
//         /* ボタンの余白分だけ微調整 */
//         margin-inline-end: ${space(-0.25)};
//       }
//     }
//   `
// })
