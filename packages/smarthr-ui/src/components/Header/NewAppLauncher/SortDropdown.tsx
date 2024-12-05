import React, { FC } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../themes'
import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../Icon'
import { Stack } from '../../Layout'

const sortMap = {
  default: 'デフォルト',
  'name/asc': 'アプリ名の昇順',
  'name/desc': 'アプリ名の降順',
}

const sortDropdown = tv({
  slots: {
    trigger: [
      'smarthr-ui-AppLauncher-SortDropdown-trigger',
      'shr-gap-0.25 shr-text-grey',
      '[&[aria-expanded="true"]>.smarthr-ui-Icon]:shr-rotate-180',
    ],
    stack: ['shr-px-0.25 shr-py-0.5'],
    contentButton: ['shr-border-none shr-justify-start shr-py-0.75 shr-font-normal shr-pl-2.5'],
  },
  variants: {
    selected: {
      true: {
        contentButton: ['shr-pl-1'],
      },
    },
  },
})

export const SortDropdown: FC = () => {
  const { trigger, stack, contentButton } = sortDropdown()

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={trigger()} size="s" variant="text" suffix={<FaCaretDownIcon />}>
          表示順
        </Button>
      </DropdownTrigger>

      <DropdownContent>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Stack className={stack()} gap={0} align="stretch">
          {Object.entries(sortMap).map(([key, value], i) => (
            <Button
              key={i}
              className={contentButton({ selected: key === 'default' })}
              prefix={key === 'default' && <FaCheckIcon color={textColor.main} alt="選択中" />}
              // onClick={() => onClickSort(key as CustomizeDialog['sort'])}
              onClick={() => console.log(key)}
            >
              {value}
            </Button>
          ))}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}
