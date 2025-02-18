import { type FC, type MouseEvent, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { Button } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import type { Launcher } from '../../types'

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
  const translated = useMemo(
    () => ({
      favorite: translate('Launcher/favoriteModeText'),
      all: translate('MobileHeader/Menu/allAppButton'),
      checkIconAlt: translate('Launcher/sortDropdownSelected'),
    }),
    [translate],
  )

  const onClickButton = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onSelectPage(e.currentTarget.value as Launcher['page'])
    },
    [onSelectPage],
  )

  const isFavorite = page === 'favorite'
  const buttonPrefix = (
    <FaCheckIcon color={textColor.main} alt={<Translate>{translated.checkIconAlt}</Translate>} />
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
          <Button
            value="favorite"
            aria-selected={isFavorite}
            onClick={onClickButton}
            className={classNames.contentButton}
            prefix={isFavorite && buttonPrefix}
          >
            <Translate>{translated.favorite}</Translate>
          </Button>
          <Button
            value="all"
            aria-selected={!isFavorite}
            onClick={onClickButton}
            className={classNames.contentButton}
            prefix={!isFavorite && buttonPrefix}
          >
            <Translate>{translated.all}</Translate>
          </Button>
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
