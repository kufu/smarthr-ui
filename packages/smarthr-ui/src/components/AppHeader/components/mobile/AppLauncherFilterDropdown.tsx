import React, { FC } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { useIntl } from '../../../..'
import { Localizer } from '../../../../intl/Localizer'
import { Launcher } from '../../types'

type Props = {
  page: Launcher['page']
  onSelectPage: (page: Launcher['page']) => void
}

const filterDropdown = tv({
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

export const AppLauncherFilterDropdown: FC<Props> = ({ page, onSelectPage }) => {
  const { localize } = useIntl()
  const { trigger, stack, contentButton } = filterDropdown()
  const filterMap: Record<Launcher['page'], string> = {
    favorite: localize({
      id: 'smarthr-ui/AppHeader/favoriteModeText',
      defaultText: 'よく使うアプリ',
    }),
    all: localize({ id: 'smarthr-ui/AppHeader/allAppButton', defaultText: 'すべてのアプリ' }),
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={trigger()} size="s" suffix={<FaCaretDownIcon />}>
          {filterMap[page]}
        </Button>
      </DropdownTrigger>

      <DropdownContent>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Stack className={stack()} gap={0} align="stretch">
          {Object.entries(filterMap).map(([key, value], i) => {
            const isSelected = key === page

            return (
              <Button
                key={i}
                className={contentButton({ selected: isSelected })}
                prefix={
                  isSelected && (
                    <FaCheckIcon
                      color={textColor.main}
                      alt={
                        <Localizer
                          id="smarthr-ui/AppHeader/sortDropdownSelected"
                          defaultText="選択中"
                          values={{}}
                        />
                      }
                    />
                  )
                }
                onClick={() => {
                  onSelectPage(key as Launcher['page'])
                }}
              >
                {value}
              </Button>
            )
          })}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}
