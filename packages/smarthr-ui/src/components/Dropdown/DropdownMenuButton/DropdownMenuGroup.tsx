import React, { type PropsWithChildren, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../Text'

import { renderButtonList } from './DropdownMenuButton'

type Props = PropsWithChildren<{
  name?: ReactNode
}>

const dropdownMenuGroup = tv({
  slots: {
    group: [
      '[&:not(:first-child)]:shr-relative',
      '[&:not(:first-child)]:shr-mt-0.5',
      '[&:not(:first-child)]:shr-pt-0.5',
      '[&:not(:first-child)]:before:shr-content-[""]',
      '[&:not(:first-child)]:before:shr-absolute',
      '[&:not(:first-child)]:before:shr-top-0',
      '[&:not(:first-child)]:before:shr-inset-x-0.5',
      '[&:not(:first-child)]:before:shr-h-px',
      '[&:not(:first-child)]:before:shr-bg-border',
    ],
    groupName: 'shr-px-1 shr-py-0.5',
  },
})
const { group, groupName } = dropdownMenuGroup()

export const DropdownMenuGroup: React.FC<Props> = ({ name, children }) => (
  <li className={group()}>
    {name && (
      <Text as="p" size="S" weight="bold" color="TEXT_GREY" leading="NONE" className={groupName()}>
        {name}
      </Text>
    )}
    <ul>{renderButtonList(children)}</ul>
  </li>
)
