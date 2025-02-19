import React, { FC, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { useTranslate } from '../../hooks/useTranslate'
import { Launcher } from '../../types'
import { Translate } from '../common/Translate'

const sortDropdown = tv({
  slots: {
    trigger: [
      'smarthr-ui-AppLauncher-SortDropdown-trigger',
      'shr-gap-0.25 shr-text-grey',
      '[&[aria-expanded="true"]>.smarthr-ui-Icon]:shr-rotate-180',
    ],
    contentBody: ['shr-px-0.25 shr-py-0.5', 'shr-flex-col shr-flex shr-items-stretch'],
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
  const { trigger, contentBody, contentButton } = sortDropdown()

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
        <div className={contentBody()}>
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
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
