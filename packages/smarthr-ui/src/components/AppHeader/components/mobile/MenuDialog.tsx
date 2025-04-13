import {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

import { Button } from '../../../Button'
import { FocusTrap } from '../../../Dialog/FocusTrap'
import { FaXmarkIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Section } from '../../../SectioningContent'
import { useTranslate } from '../../hooks/useTranslate'

import { AppLauncher } from './AppLauncher'
import { AppLauncherContext } from './AppLauncherContext'
import { MenuSubHeading } from './MenuSubHeading'
import { Navigation } from './Navigation'
import { NavigationContext } from './NavigationContext'
import { NavigationGroupHeader } from './NavigationGroupHeader'
import { ReleaseNote } from './ReleaseNote'
import { ReleaseNoteContext } from './ReleaseNoteContext'

const menu = tv({
  slots: {
    wrapper: [
      'shr-fixed shr-top-0 shr-left-0 shr-w-full shr-h-full shr-flex shr-flex-col shr-bg-white',
      'shr-translate-opacity shr-opacity-0 shr-duration-150',
      '[&&.shr-sp-menu-enter-active]:shr-opacity-100',
      '[&&.shr-sp-menu-enter-done]:shr-opacity-100',
      '[&&.shr-sp-menu-exit-active]:shr-opacity-0',
      '[&&.shr-sp-menu-exit-done]:shr-opacity-0',
    ],
    header: 'shr-px-0.75 shr-py-0.5 shr-border-b-shorthand shr-sticky shr-top-0',
    content: 'shr-overflow-auto shr-p-1',
  },
})

export const MenuDialog: FC<
  PropsWithChildren<{
    isOpen: boolean
    setIsOpen: Dispatch<boolean>
    tenantSelector: ReactNode
  }>
> = ({ children, isOpen, setIsOpen, tenantSelector }) => {
  const { selectedNavigationGroup, setSelectedNavigationGroup } = useContext(NavigationContext)
  const { isReleaseNoteSelected, setIsReleaseNoteSelected } = useContext(ReleaseNoteContext)
  const { features, isAppLauncherSelected, setIsAppLauncherSelected } =
    useContext(AppLauncherContext)

  const [contentBuffer, setContentBuffer] = useState<ReactNode>(null)
  const translate = useTranslate()
  const domRef = useRef<HTMLSelectElement>(null)

  const renderedContent = useMemo(() => {
    const { wrapper, header, content } = menu()

    return (
      // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
      <Section role="dialog" aria-modal="true" className={wrapper()} ref={domRef}>
        <div className={header()}>
          <Cluster justify="space-between" align="center">
            {isAppLauncherSelected ? (
              <MenuSubHeading
                title={translate('Launcher/listText')}
                onClickBack={() => setIsAppLauncherSelected(false)}
              />
            ) : isReleaseNoteSelected ? (
              <MenuSubHeading
                title={translate('MobileHeader/Menu/latestReleaseNotes')}
                onClickBack={() => setIsReleaseNoteSelected(false)}
              />
            ) : selectedNavigationGroup ? (
              <NavigationGroupHeader title={selectedNavigationGroup.children} />
            ) : (
              <div>{tenantSelector}</div>
            )}

            <Button variant="secondary" size="s" onClick={() => setIsOpen(false)}>
              <FaXmarkIcon alt={translate('MobileHeader/Menu/closeMenu')} />
            </Button>
          </Cluster>
        </div>

        {isAppLauncherSelected && features && features.length > 0 ? (
          <AppLauncher features={features} />
        ) : (
          <div className={content()}>
            {isReleaseNoteSelected ? (
              <ReleaseNote />
            ) : selectedNavigationGroup ? (
              <Navigation
                navigations={selectedNavigationGroup.childNavigations}
                onClickNavigation={() => setIsOpen(false)}
              />
            ) : (
              children
            )}
          </div>
        )}
      </Section>
    )
  }, [
    translate,
    children,
    features,
    isAppLauncherSelected,
    isReleaseNoteSelected,
    selectedNavigationGroup,
    setIsAppLauncherSelected,
    setIsOpen,
    setIsReleaseNoteSelected,
    tenantSelector,
  ])

  useEffect(() => {
    if (isOpen) {
      setContentBuffer(renderedContent)
    } else {
      setIsReleaseNoteSelected(false)
      setIsAppLauncherSelected(false)
      setSelectedNavigationGroup(null)
    }
  }, [
    isOpen,
    renderedContent,
    setIsAppLauncherSelected,
    setIsReleaseNoteSelected,
    setSelectedNavigationGroup,
  ])

  return (
    <CSSTransition
      classNames="shr-sp-menu"
      in={isOpen}
      timeout={300}
      unmountOnExit
      nodeRef={domRef}
    >
      <div className="shr-fixed shr-z-overlap-base">
        <FocusTrap>{isOpen ? renderedContent : contentBuffer}</FocusTrap>
      </div>
    </CSSTransition>
  )
}
