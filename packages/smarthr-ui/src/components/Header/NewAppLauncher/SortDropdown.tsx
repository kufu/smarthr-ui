import React, { FC, ReactNode, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../themes'
import { DecoratorsType } from '../../../types'
import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../Icon'
import { Stack } from '../../Layout'

import { SortType, TEXT } from './constants'

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
  sortType: SortType
  onSelectSortType: (sortType: SortType) => void
  decorators?: DecoratorsType<keyof typeof TEXT>
}

export const SortDropdown: FC<Props> = ({ sortType, onSelectSortType, decorators }) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { trigger, stack, contentButton } = sortDropdown()

  const sortMap: Record<SortType, ReactNode> = {
    default:
      decorators?.sortDropdownOrderDefault?.(TEXT.sortDropdownOrderDefault) ||
      TEXT.sortDropdownOrderDefault,
    'name/asc':
      decorators?.sortDropdownOrderNameAsc?.(TEXT.sortDropdownOrderNameAsc) ||
      TEXT.sortDropdownOrderNameAsc,
    'name/desc':
      decorators?.sortDropdownOrderNameDesc?.(TEXT.sortDropdownOrderNameDesc) ||
      TEXT.sortDropdownOrderNameDesc,
  }
  const text = {
    sortDropdownLabel:
      decorators?.sortDropdownLabel?.(TEXT.sortDropdownLabel) || TEXT.sortDropdownLabel,
    sortDropdownSelected:
      decorators?.sortDropdownSelected?.(TEXT.sortDropdownSelected) || TEXT.sortDropdownSelected,
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
          {text.sortDropdownLabel}
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
                  <FaCheckIcon color={textColor.main} alt={text.sortDropdownSelected} />
                )
              }
              onClick={() => {
                onSelectSortType(key as SortType)

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
              {value}
            </Button>
          ))}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}
