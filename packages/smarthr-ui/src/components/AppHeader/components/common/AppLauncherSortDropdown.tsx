import { type FC, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import type { Launcher } from '../../types'

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

type Props = {
  sortType: Launcher['sortType']
  onSelectSortType: (sortType: Launcher['sortType']) => void
}

export const AppLauncherSortDropdown: FC<Props> = ({ sortType, onSelectSortType }) => {
  const translate = useTranslate()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { trigger, stack, contentButton } = sortDropdown()

  const sortMap: Record<Launcher['sortType'], string> = {
    default: translate('Launcher/sortDropdownOrderDefault'),
    'name/asc': translate('Launcher/sortDropdownOrderNameAsc'),
    'name/desc': translate('Launcher/sortDropdownOrderNameDesc'),
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className={trigger()}
          size="s"
          variant="text"
          suffix={<FaCaretDownIcon />}
          ref={triggerRef}
        >
          <Translate>{translate('Launcher/sortDropdownLabel')}</Translate>
        </Button>
      </DropdownTrigger>

      <DropdownContent controllable>
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Stack className={stack()} gap={0} align="stretch">
          {Object.entries(sortMap).map(([key, value], i) => (
            <Button
              key={i}
              className={contentButton({ selected: key === sortType })}
              prefix={
                key === sortType && (
                  <FaCheckIcon
                    color={textColor.main}
                    alt={<Translate>{translate('Launcher/sortDropdownSelected')}</Translate>}
                  />
                )
              }
              onClick={() => {
                onSelectSortType(key as Launcher['sortType'])

                // Dropdown がネストしており、この Dropdown のみ閉じて親の Dropdown は開いたままというのができない
                // そのため、無理矢理クリックイベントを発生させて実現している
                setTimeout(() => {
                  if (triggerRef.current) {
                    triggerRef.current.click()
                    triggerRef.current.focus()
                  }
                }, 0)
              }}
            >
              <Translate>{value}</Translate>
            </Button>
          ))}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}
