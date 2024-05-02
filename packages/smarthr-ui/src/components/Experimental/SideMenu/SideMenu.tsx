import React, { ComponentProps, FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Stack } from '../../Layout'

import { SideMenuGroup } from './SideMenuGroup'
import { SideMenuItem } from './SideMenuItem'

type SubComponents = {
  /** @deprecated SideMenu は削除予定です */
  Group: typeof SideMenuGroup
  /** @deprecated SideMenu は削除予定です */
  Item: typeof SideMenuItem
}

const sideMenu = tv({
  base: 'smarthr-ui-SideMenu shr-list-none',
})

/** @deprecated SideMenu コンポーネントは 2024/01 に削除予定です。別コンポーネントで代替するか、UI を見直してください。 */
export const SideMenu: FC<ComponentProps<typeof Stack>> & SubComponents = ({
  className,
  ...rest
}) => {
  const styles = useMemo(() => sideMenu({ className }), [className])
  return (
    // eslint-disable-next-line smarthr/best-practice-for-layouts
    <Stack {...rest} as="ul" inline gap={0.75} className={styles} />
  )
}
SideMenu.Group = SideMenuGroup
SideMenu.Item = SideMenuItem
