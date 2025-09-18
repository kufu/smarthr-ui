import { type MouseEvent, type PropsWithChildren, memo, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { textColor } from '../../../../themes'
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

  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      favorite: localize({
        id: 'smarthr-ui/AppHeader/Launcher/favoriteModeText',
        defaultText: 'よく使うアプリ',
      }),
      all: localize({
        id: 'smarthr-ui/AppHeader/Launcher/allModeText',
        defaultText: 'すべてのアプリ',
      }),
      checkIconAlt: localize({
        id: 'smarthr-ui/AppHeader/Launcher/sortDropdownSelected',
        defaultText: '選択中',
      }),
    }),
    [localize],
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
      <Button className={className} size="s" suffix={<FaCaretDownIcon aria-hidden={true} />}>
        <Translate>{children}</Translate>
      </Button>
    </DropdownTrigger>
  ),
)

const ContentBody = memo<
  Props & {
    translated: { favorite: string; all: string; checkIconAlt: string }
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
    <div role="listbox" className={className}>
      <Button
        value="favorite"
        role="option"
        aria-selected={isFavorite}
        onClick={onClickButton}
        className={buttonClassName}
        prefix={isFavorite && buttonPrefix}
      >
        <Translate>{translated.favorite}</Translate>
      </Button>
      <Button
        value="all"
        role="option"
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
