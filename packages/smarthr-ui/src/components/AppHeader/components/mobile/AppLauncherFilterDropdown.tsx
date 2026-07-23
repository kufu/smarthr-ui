'use client'

import { type MouseEvent, memo, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../../../hooks/useTheme'
import { Localizer } from '../../../../intl'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { Translate } from '../common/Translate'

import type { Launcher } from '../../types'

type Props = {
  page: Launcher['page']
  onSelectPage: (page: Launcher['page']) => void
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

export const AppLauncherFilterDropdown = memo<Props>(({ page, onSelectPage }) => {
  const classNames = useMemo(() => {
    const { trigger, contentBody, contentButton } = classNameGenerator()

    return {
      trigger: trigger(),
      contentBody: contentBody(),
      contentButton: contentButton(),
    }
  }, [])

  return (
    <Dropdown>
      <MemoizedDropdownTrigger className={classNames.trigger} page={page} />
      <DropdownContent>
        <ContentBody
          page={page}
          onSelectPage={onSelectPage}
          className={classNames.contentBody}
          buttonClassName={classNames.contentButton}
        />
      </DropdownContent>
    </Dropdown>
  )
})

const MemoizedDropdownTrigger = memo<{ page: Launcher['page']; className: string }>(
  ({ page, className }) => (
    <DropdownTrigger>
      <Button className={className} size="S" suffix={<FaCaretDownIcon />}>
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
>(({ page, onSelectPage, className, buttonClassName }) => {
  const theme = useTheme()
  const isFavorite = page === 'favorite'

  const onClickButton = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onSelectPage(e.currentTarget.value as Launcher['page'])
    },
    [onSelectPage],
  )

  const buttonPrefix = (
    <FaCheckIcon
      color={theme.textColor.main}
      alt={
        <Translate>
          <Localizer id="smarthr-ui/AppHeader/Launcher/sortDropdownSelected" defaultText="選択中" />
        </Translate>
      }
    />
  )

  return (
    <div role="listbox" className={className}>
      <Button
        value="favorite"
        role="option"
        aria-selected={isFavorite}
        onClick={onClickButton}
        className={buttonClassName}
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
        value="all"
        role="option"
        aria-selected={!isFavorite}
        onClick={onClickButton}
        className={buttonClassName}
        prefix={!isFavorite && buttonPrefix}
      >
        <Translate>
          <Localizer id="smarthr-ui/AppHeader/Launcher/allModeText" defaultText="すべてのアプリ" />
        </Translate>
      </Button>
    </div>
  )
})
