import React, { type FC, type ReactNode, useContext, useEffect, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../..'
import { useHandleEscape } from '../../../../hooks/useHandleEscape'
import { usePortal } from '../../../../hooks/usePortal'
import { Localizer } from '../../../../intl/Localizer'
import { Button } from '../../../Button'
import { FaAngleRightIcon, FaBarsIcon, FaToolboxIcon } from '../../../Icon'

import { AppLauncherContext } from './AppLauncherContext'
import { MenuAccordion } from './MenuAccordion'
import { MenuButton } from './MenuButton'
import { MenuDialog } from './MenuDialog'
import { Navigation } from './Navigation'
import { NavigationContext } from './NavigationContext'
import { ReleaseNoteContext } from './ReleaseNoteContext'

const menuItemBlock = tv({
  base: ['shr-border-t-shorthand shr-py-1', 'first:shr-border-t-0 first:shr-pt-0'],
})

let scrollPosition = 0

type Props = {
  appName: ReactNode
  tenantSelector: ReactNode
  additionalContent: ReactNode
}

export const Menu: FC<Props> = ({ appName, tenantSelector, additionalContent }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isNavigationOpen, setIsNavigationOpen] = useState(true)
  const [isAdditionalContentOpen, setIsAdditionalContentOpen] = useState(true)

  const { navigations } = useContext(NavigationContext)
  const { releaseNote, setIsReleaseNoteSelected } = useContext(ReleaseNoteContext)
  const { features, setIsAppLauncherSelected } = useContext(AppLauncherContext)

  const { localize } = useIntl()
  const { createPortal } = usePortal()

  useEffect(() => {
    if (isOpen) {
      scrollPosition = window.scrollY
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setTimeout(() => window.scrollTo(0, scrollPosition), 0)
    }
  }, [isOpen])

  useHandleEscape(() => setIsOpen(false))

  const menuItemBlockStyle = menuItemBlock()

  return (
    <>
      <Button variant="secondary" size="s" onClick={() => setIsOpen(true)} aria-haspopup="true">
        <FaBarsIcon
          role="img"
          aria-label={localize({
            id: 'smarthr-ui/AppHeader/openMenu',
            defaultText: 'メニューを開く',
          })}
        />
      </Button>

      {createPortal(
        <MenuDialog isOpen={isOpen} setIsOpen={setIsOpen} tenantSelector={tenantSelector}>
          {features && features.length > 0 && (
            <div className={menuItemBlockStyle}>
              {/* eslint-disable-next-line smarthr/a11y-clickable-element-has-text */}
              <Button
                variant="secondary"
                wide
                prefix={<FaToolboxIcon />}
                suffix={
                  <div className="shr-ms-auto">
                    <FaAngleRightIcon />
                  </div>
                }
                onClick={() => setIsAppLauncherSelected(true)}
              >
                <Localizer
                  id="smarthr-ui/AppHeader/listText"
                  defaultText="アプリ一覧"
                  values={{}}
                />
              </Button>
            </div>
          )}

          {navigations.length > 0 && appName ? (
            <div className={menuItemBlockStyle}>
              <MenuAccordion
                isOpen={isNavigationOpen}
                setIsOpen={setIsNavigationOpen}
                title={appName}
              >
                <Navigation navigations={navigations} onClickNavigation={() => setIsOpen(false)} />
              </MenuAccordion>
            </div>
          ) : (
            <div className={menuItemBlockStyle}>
              <Navigation navigations={navigations} onClickNavigation={() => setIsOpen(false)} />
            </div>
          )}

          {additionalContent && (
            <div className={menuItemBlockStyle}>
              <MenuAccordion
                isOpen={isAdditionalContentOpen}
                setIsOpen={setIsAdditionalContentOpen}
                title={localize({
                  id: 'smarthr-ui/AppHeader/managementMenu',
                  defaultText: '管理メニュー',
                })}
              >
                {additionalContent}
              </MenuAccordion>
            </div>
          )}

          {releaseNote && (
            <div className={menuItemBlockStyle}>
              <MenuButton onClick={() => setIsReleaseNoteSelected(true)}>
                <Localizer
                  id="smarthr-ui/AppHeader/releaseNote"
                  defaultText="リリースノート"
                  values={{}}
                />
              </MenuButton>
            </div>
          )}
        </MenuDialog>,
      )}
    </>
  )
}
