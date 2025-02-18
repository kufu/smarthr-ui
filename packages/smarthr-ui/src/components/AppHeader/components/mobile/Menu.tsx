import React, { type FC, type ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useHandleEscape } from '../../../../hooks/useHandleEscape'
import { usePortal } from '../../../../hooks/usePortal'
import { Button } from '../../../Button'
import { FaAngleRightIcon, FaBarsIcon, FaToolboxIcon } from '../../../Icon'
import { useTranslate } from '../../hooks/useTranslate'
import { Translate } from '../common/Translate'

import { AppLauncherContext } from './AppLauncherContext'
import { MenuAccordion } from './MenuAccordion'
import { MenuButton } from './MenuButton'
import { MenuDialog } from './MenuDialog'
import { Navigation } from './Navigation'
import { NavigationContext } from './NavigationContext'
import { ReleaseNoteContext } from './ReleaseNoteContext'

const classNameGenerator = tv({
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

  const className = useMemo(() => classNameGenerator(), [])
  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      open: translate('MobileHeader/Menu/openMenu'),
      launcherListText: translate('Launcher/listText'),
      management: translate('MobileHeader/Menu/managementMenu'),
      releaseNote: translate('common/releaseNote'),
    }),
    [translate],
  )

  return (
    <>
      <Button variant="secondary" size="s" onClick={() => setIsOpen(true)} aria-haspopup="true">
        <FaBarsIcon alt={translated.open} />
      </Button>

      {createPortal(
        <MenuDialog isOpen={isOpen} setIsOpen={setIsOpen} tenantSelector={tenantSelector}>
          {features && features.length > 0 && (
            <div className={className}>
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
                <Translate>{translated.launcherListText}</Translate>
              </Button>
            </div>
          )}

          {navigations.length > 0 && appName ? (
            <div className={className}>
              <MenuAccordion
                isOpen={isNavigationOpen}
                setIsOpen={setIsNavigationOpen}
                title={appName}
              >
                <Navigation navigations={navigations} onClickNavigation={() => setIsOpen(false)} />
              </MenuAccordion>
            </div>
          ) : (
            <div className={className}>
              <Navigation navigations={navigations} onClickNavigation={() => setIsOpen(false)} />
            </div>
          )}

          {additionalContent && (
            <div className={className}>
              <MenuAccordion
                isOpen={isAdditionalContentOpen}
                setIsOpen={setIsAdditionalContentOpen}
                title={translated.management}
              >
                {additionalContent}
              </MenuAccordion>
            </div>
          )}

          {releaseNote && (
            <div className={className}>
              <MenuButton onClick={() => setIsReleaseNoteSelected(true)}>
                {translated.releaseNote}
              </MenuButton>
            </div>
          )}
        </MenuDialog>,
      )}
    </>
  )
}
