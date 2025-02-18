import React, { type MouseEvent, type PropsWithChildren, memo, useCallback, useMemo } from 'react'
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

const classNameGenerator = tv({
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

export const AppLauncherFilterDropdown = memo<Props>(({ page, onSelectPage }) => {
  const classNames = useMemo(() => {
    const { trigger, contentBody, contentButton } = classNameGenerator()

    return {
      trigger: trigger(),
      contentBody: contentBody(),
      contentButton: contentButton(),
    }
  }, [])

  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      favorite: translate('Launcher/favoriteModeText'),
      all: translate('MobileHeader/Menu/allAppButton'),
      checkIconAlt: translate('Launcher/sortDropdownSelected'),
    }),
    [translate],
  )

  return (
    <Dropdown>
      <MemoizedDropdownTrigger className={classNames.trigger}>
        {translated[page]}
      </MemoizedDropdownTrigger>
      <DropdownContent>
        <ContentBody
          page={page}
          onSelectPage={onSelectPage}
          translated={translated}
          className={classNames.contentBody}
          buttonClassName={classNames.contentButton}
        />
      </DropdownContent>
    </Dropdown>
  )
})

const MemoizedDropdownTrigger = memo<PropsWithChildren<{ className: string }>>(
  ({ children, className }) => (
    <DropdownTrigger>
      <Button className={className} size="s" suffix={<FaCaretDownIcon />}>
        <Translate>{children}</Translate>
      </Button>
    </DropdownTrigger>
  ),
)

const ContentBody = memo<
  Props & {
    translated: { favorite: string; all: string }
    className: string
    buttonClassName: string
  }
>(({ page, onSelectPage, translated, className, buttonClassName }) => {
  const isFavorite = page === 'favorite'

  const onClickButton = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onSelectPage(e.currentTarget.value as Launcher['page'])
    },
    [onSelectPage],
  )

  const buttonPrefix = (
    <FaCheckIcon color={textColor.main} alt={<Translate>{translated.checkIconAlt}</Translate>} />
  )

  return (
    <div className={className}>
      <Button
        value="favorite"
        aria-selected={isFavorite}
        onClick={onClickButton}
        className={buttonClassName}
        prefix={isFavorite && buttonPrefix}
      >
        <Translate>{translated.favorite}</Translate>
      </Button>
      <Button
        value="all"
        aria-selected={!isFavorite}
        onClick={onClickButton}
        className={buttonClassName}
        prefix={!isFavorite && buttonPrefix}
      >
        <Translate>{translated.all}</Translate>
      </Button>
    </div>
  )
})
