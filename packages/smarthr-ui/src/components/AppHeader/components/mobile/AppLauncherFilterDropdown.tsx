import React, { type FC, type MouseEvent, useCallback, useMemo } from 'react'
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
    contentBody: ['shr-px-0.25 shr-py-0.5 shr-flex shr-flex-col shr-items-stretch'],
    contentButton: [
      'shr-border-none shr-justify-start shr-py-0.75 shr-font-normal shr-pl-2.5',
      'aria-selected:shr-pl-1',
    ],
  },
})

export const AppLauncherFilterDropdown: FC<Props> = ({ page, onSelectPage }) => {
  const classNames = useMemo(() => {
    const { trigger, contentBody, contentButton } = filterDropdown()

    return {
      trigger: trigger(),
      contentBody: contentBody(),
      contentButton: contentButton(),
    }
  }, [])

  const translate = useTranslate()
  const translated = useMemo<Record<Launcher['page'], string>>(
    () => ({
      favorite: translate('Launcher/favoriteModeText'),
      all: translate('MobileHeader/Menu/allAppButton'),
    }),
    [translate],
  )

  const onClickButton = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onSelectPage(e.currentTarget.value as Launcher['page'])
    },
    [onSelectPage],
  )

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className={classNames.trigger} size="s" suffix={<FaCaretDownIcon />}>
          <Translate>{translated[page]}</Translate>
        </Button>
      </DropdownTrigger>

      <DropdownContent>
        <div className={classNames.contentBody}>
          {Object.entries(translated).map(([key, value], i) => {
            const isSelected = key === page

            return (
              <Button
                key={i}
                value={key}
                aria-selected={isSelected}
                onClick={onClickButton}
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
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
