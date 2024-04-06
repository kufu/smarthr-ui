import React, { ComponentProps, PropsWithChildren, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Stack } from '../../Layout'
import { Text } from '../../Text'

type Props = PropsWithChildren<{
  /** 分類ラベル */
  name: ReactNode
  /** 分類ラベルの HTML タグ */
  nameTag?: ComponentProps<typeof Text>['as']
}>
type ElementProps = ComponentProps<typeof Stack>

const sideMenuGroup = tv({
  slots: {
    wrapper: ['smarthr-ui-SideMenu-group', '[&_+_&]:shr-border-t-shorthand [&_+_&]:shr-pt-1.25'],
    list: 'shr-list-none',
  },
})

export const SideMenuGroup: React.FC<Props & ElementProps> = ({
  name,
  nameTag = 'h3',
  children,
  className,
  ...rest
}) => {
  const { wrapperStyle, listStyle } = useMemo(() => {
    const { wrapper, list } = sideMenuGroup()
    return {
      wrapperStyle: wrapper({ className }),
      listStyle: list(),
    }
  }, [className])

  return (
    <Stack {...rest} as="li" gap={0.5} className={wrapperStyle}>
      <Text color="TEXT_GREY" leading="TIGHT" size="S" weight="normal" as={nameTag}>
        {name}
      </Text>
      {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
      <Stack as="ul" gap={0} className={listStyle}>
        {children}
      </Stack>
    </Stack>
  )
}
