import {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
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

  const dialogClose = useCallback(() => setIsOpen(false), [setIsOpen])
  const clearAppLauncher = useCallback(
    () => setIsAppLauncherSelected(false),
    [setIsAppLauncherSelected],
  )
  const clearReleaseNote = useCallback(
    () => setIsReleaseNoteSelected(false),
    [setIsReleaseNoteSelected],
  )
  const clearNavigationGroup = useCallback(
    () => setSelectedNavigationGroup(null),
    [setSelectedNavigationGroup],
  )

  const renderedContent = useMemo(() => {
    const { wrapper, header, content } = menu()

    return (
      <Section role="dialog" aria-modal="true" className={wrapper()} ref={domRef}>
        <div className={header()}>
          <Cluster justify="space-between" align="center">
            {isAppLauncherSelected ? (
              <MenuSubHeading
                title={translate('Launcher/listText')}
                onClickBack={clearAppLauncher}
              />
            ) : isReleaseNoteSelected ? (
              // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
              <MenuSubHeading
                title={translate('MobileHeader/Menu/latestReleaseNotes')}
                onClickBack={clearReleaseNote}
              />
            ) : selectedNavigationGroup ? (
              // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
              <MenuSubHeading
                title={selectedNavigationGroup.children}
                onClickBack={clearNavigationGroup}
              />
            ) : (
              <div>{tenantSelector}</div>
            )}

            <Button variant="secondary" size="s" onClick={dialogClose}>
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
                onClickNavigation={dialogClose}
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
    clearAppLauncher,
    tenantSelector,
    dialogClose,
    clearReleaseNote,
    clearNavigationGroup,
  ])

  useEffect(() => {
    if (isOpen) {
      setContentBuffer(renderedContent)
    } else {
      clearReleaseNote()
      clearAppLauncher()
      clearNavigationGroup()
    }
  }, [isOpen, renderedContent, clearAppLauncher, clearReleaseNote, clearNavigationGroup])

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
