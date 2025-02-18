import React, { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { useTranslate } from '../../hooks/useTranslate'
import { Launcher } from '../../types'
import { Translate } from '../common/Translate'

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
    contentButton: [
      'shr-border-none shr-justify-start shr-py-0.75 shr-font-normal shr-pl-2.5',
      'aria-selected:shr-pl-1',
    ],
  },
})

export const AppLauncherFilterDropdown: FC<Props> = ({ page, onSelectPage }) => {
  const classNames = useMemo(() => {
    const { trigger, stack, contentButton } = filterDropdown()

    return {
      trigger: trigger(),
      stack: stack(),
      contentButton: contentButton(),
    }
  }, [])

  const translate = useTranslate()
  const filterMap: Record<Launcher['page'], string> = {
    favorite: translate('Launcher/favoriteModeText'),
    all: translate('MobileHeader/Menu/allAppButton'),
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={classNames.trigger} size="s" suffix={<FaCaretDownIcon />}>
          <Translate>{filterMap[page]}</Translate>
        </Button>
      </DropdownTrigger>

      <DropdownContent>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Stack className={classNames.stack} gap={0} align="stretch">
          {Object.entries(filterMap).map(([key, value], i) => {
            const isSelected = key === page

            return (
              <Button
                key={i}
                aria-selected={isSelected}
                onClick={() => {
                  onSelectPage(key as Launcher['page'])
                }}
                className={classNames.contentButton}
                prefix={
                  isSelected && (
                    <FaCheckIcon
                      color={textColor.main}
                      alt={<Translate>{translate('Launcher/sortDropdownSelected')}</Translate>}
                    />
                  )
                }
              >
                <Translate>{value}</Translate>
              </Button>
            )
          })}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}
