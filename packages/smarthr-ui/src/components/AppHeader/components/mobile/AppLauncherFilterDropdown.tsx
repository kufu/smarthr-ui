'use client'

import { type MouseEvent, memo, useCallback } from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../../../hooks/client/useTheme'
import { Localizer } from '../../../../intl'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { Translate } from '../common/Translate'

import type { Launcher } from '../../types'

type Props = {
  page: Launcher['page']
  handleSelectPage: (page: Launcher['page']) => void
}

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-AppLauncher-SortDropdown-trigger',
      'shr-gap-0.25 shr-text-grey',
      '[&[aria-expanded="true"]_.smarthr-ui-Icon]:shr-rotate-180',
    ],
    contentBody: ['shr-flex shr-flex-col shr-items-stretch shr-px-0.25 shr-py-0.5'],
    contentButton: [
      'shr-justify-start shr-border-none shr-py-0.75 shr-pl-2.5 shr-font-normal',
      'aria-selected:shr-pl-1',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { trigger, contentBody, contentButton } = classNameGenerator()

  return {
    trigger: trigger(),
    contentBody: contentBody(),
    contentButton: contentButton(),
  }
})()

export const AppLauncherFilterDropdown = memo<Props>(({ page, handleSelectPage }) => (
  <Dropdown>
    <MemoizedDropdownTrigger page={page} className={CLASS_NAMES.trigger} />
    <DropdownContent>
      <ContentBody
        page={page}
        className={CLASS_NAMES.contentBody}
        buttonClassName={CLASS_NAMES.contentButton}
        handleSelectPage={handleSelectPage}
      />
    </DropdownContent>
  </Dropdown>
))

const MemoizedDropdownTrigger = memo<{ page: Launcher['page']; className: string }>(
  ({ page, className }) => (
    <DropdownTrigger>
      <Button size="S" className={className} suffix={<FaCaretDownIcon />}>
        <Translate>
          {page === 'favorite' ? (
            <Localizer
              id="smarthr-ui/AppHeader/Launcher/favoriteModeText"
              defaultText="よく使うアプリ"
            />
          ) : (
            <Localizer
              id="smarthr-ui/AppHeader/Launcher/allModeText"
              defaultText="すべてのアプリ"
            />
          )}
        </Translate>
      </Button>
    </DropdownTrigger>
  ),
)

const ContentBody = memo<
  Props & {
    className: string
    buttonClassName: string
  }
>(({ page, handleSelectPage, className, buttonClassName }) => {
  const theme = useTheme()
  const isFavorite = page === 'favorite'

  const handleClickButton = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      handleSelectPage(e.currentTarget.value as Launcher['page'])
    },
    [handleSelectPage],
  )

  const buttonPrefix = (
    <FaCheckIcon
      alt={
        <Translate>
          <Localizer id="smarthr-ui/AppHeader/Launcher/sortDropdownSelected" defaultText="選択中" />
        </Translate>
      }
      color={theme.textColor.main}
    />
  )

  return (
    <div role="listbox" className={className}>
      <Button
        role="option"
        value="favorite"
        className={buttonClassName}
        aria-selected={isFavorite}
        onClick={handleClickButton}
        prefix={isFavorite && buttonPrefix}
      >
        <Translate>
          <Localizer
            id="smarthr-ui/AppHeader/Launcher/favoriteModeText"
            defaultText="よく使うアプリ"
          />
        </Translate>
      </Button>
      <Button
        role="option"
        value="all"
        className={buttonClassName}
        aria-selected={!isFavorite}
        onClick={handleClickButton}
        prefix={!isFavorite && buttonPrefix}
      >
        <Translate>
          <Localizer id="smarthr-ui/AppHeader/Launcher/allModeText" defaultText="すべてのアプリ" />
        </Translate>
      </Button>
    </div>
  )
})
