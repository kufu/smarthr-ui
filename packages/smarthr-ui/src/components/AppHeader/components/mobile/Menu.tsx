import React, {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
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

  const { createPortal } = usePortal()

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (isOpen) {
      scrollPosition = window.scrollY
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setTimeout(() => window.scrollTo(0, scrollPosition), 0)
    }
  }, [isOpen])

  useHandleEscape(close)

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
          <FeatureButton className={className}>{translated.launcherListText}</FeatureButton>
          <NavigationAccordion appName={appName} menuClose={close} className={className} />
          {additionalContent && (
            <AdditionalContent title={translated.management} className={className}>
              {additionalContent}
            </AdditionalContent>
          )}
          <ReleaseNoteButton className={className}>{translated.releaseNote}</ReleaseNoteButton>
        </MenuDialog>,
      )}
    </>
  )
}

const FeatureButton = memo<PropsWithChildren<{ className: string }>>(({ children, className }) => {
  const { features, setIsAppLauncherSelected } = useContext(AppLauncherContext)

  return (
    features &&
    features.length > 0 && (
      <ActualFeatureButton
        setIsAppLauncherSelected={setIsAppLauncherSelected}
        className={className}
      >
        {children}
      </ActualFeatureButton>
    )
  )
})

const ActualFeatureButton: FC<
  Pick<typeof AppLauncherContext, 'setIsAppLauncherSelected'> &
    PropsWithChildren<{ className: string }>
> = ({ setIsAppLauncherSelected, children, className }) => {
  const onClick = useCallback(() => setIsAppLauncherSelected(true), [setIsAppLauncherSelected])

  return (
    <div className={className}>
      <Button
        variant="secondary"
        wide
        prefix={<FaToolboxIcon />}
        suffix={<FeatureButtonSuffix />}
        onClick={onClick}
      >
        <Translate>{children}</Translate>
      </Button>
    </div>
  )
}

const FeatureButtonSuffix = memo(() => (
  <div className="shr-ms-auto">
    <FaAngleRightIcon />
  </div>
))

const NavigationAccordion = memo<
  Pick<Props, 'appName'> & { className: string; menuClose: () => void }
>(({ appName, menuClose, className }) => {
  const { navigations } = useContext(NavigationContext)

  const children = <Navigation navigations={navigations} onClickNavigation={menuClose} />

  return navigations.length > 0 && appName ? (
    <ActualNavigationAccordion appName={appName} className={className}>
      {children}
    </ActualNavigationAccordion>
  ) : (
    <div className={className}>{children}</div>
  )
})

const ActualNavigationAccordion: FC<
  Pick<Props, 'appName'> & PropsWithChildren<{ className: string }>
> = ({ appName, children, className }) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(true)

  return (
    <div className={className}>
      <MenuAccordion isOpen={isNavigationOpen} setIsOpen={setIsNavigationOpen} title={appName}>
        {children}
      </MenuAccordion>
    </div>
  )
}

const AdditionalContent: FC<PropsWithChildren<{ title: ReactNode; className: string }>> = ({
  title,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={className}>
      <MenuAccordion isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
        {children}
      </MenuAccordion>
    </div>
  )
}

const ReleaseNoteButton = memo<PropsWithChildren<{ className: string }>>(
  ({ children, className }) => {
    const { releaseNote, setIsReleaseNoteSelected } = useContext(ReleaseNoteContext)

    return (
      releaseNote && (
        <ActualReleaseNoteButton
          setIsReleaseNoteSelected={setIsReleaseNoteSelected}
          className={className}
        >
          {children}
        </ActualReleaseNoteButton>
      )
    )
  },
)

const ActualReleaseNoteButton = memo<
  Pick<typeof ReleaseNoteContext, 'setIsReleaseNoteSelected'> &
    PropsWithChildren<{ className: string }>
>(({ setIsReleaseNoteSelected, children, className }) => {
  const onClick = useCallback(() => setIsReleaseNoteSelected(true), [setIsReleaseNoteSelected])

  return (
    <div className={className}>
      <MenuButton onClick={onClick}>{children}</MenuButton>
    </div>
  )
})
