import React, {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { ReleaseNote } from './ReleaseNote'
import { ReleaseNoteContext } from './ReleaseNoteContext'

const classNameGenerator = tv({
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

type Props = PropsWithChildren<{
  isOpen: boolean
  setIsOpen: Dispatch<boolean>
  tenantSelector: ReactNode
}>

export const MenuDialog: FC<Props> = ({ isOpen, ...rest }) => {
  const domRef = useRef<HTMLSelectElement>(null)

  // HINT: Contentをanimationで非表示にしたい
  // アニメーションが終われば、CSSTransitionのchildrenはunmountされる
  return (
    <CSSTransition
      classNames="shr-sp-menu"
      in={isOpen}
      timeout={300}
      unmountOnExit
      nodeRef={domRef}
    >
      <div className="shr-fixed shr-z-overlap-base">
        <FocusTrap>
          <Content {...rest} domRef={domRef} />
        </FocusTrap>
      </div>
    </CSSTransition>
  )
}

const Content: FC<
  Omit<Props, 'isOpen'> & {
    domRef: RefObject<HTMLSelectElement>
  }
> = ({ domRef, children, setIsOpen, tenantSelector }) => {
  const { selectedNavigationGroup, setSelectedNavigationGroup } = useContext(NavigationContext)
  const { isReleaseNoteSelected, setIsReleaseNoteSelected } = useContext(ReleaseNoteContext)
  const { features, isAppLauncherSelected, setIsAppLauncherSelected } =
    useContext(AppLauncherContext)

  const classNames = useMemo(() => {
    const { wrapper, header, content } = classNameGenerator()

    return {
      wrapper: wrapper(),
      header: header(),
      content: content(),
    }
  }, [])

  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      launcherListText: translate('Launcher/listText'),
      latestReleaseNotes: translate('MobileHeader/Menu/latestReleaseNotes'),
      closeMenu: translate('MobileHeader/Menu/closeMenu'),
    }),
    [translate],
  )

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

  // HINT: Contentをanimationで非表示にしたい
  // アニメーションが終われば、CSSTransitionのchildrenはunmountされるため、
  // unmount時に操作内容のclearを行う
  useEffect(
    () => () => {
      clearReleaseNote()
      clearAppLauncher()
      clearNavigationGroup()
    },
    [clearAppLauncher, clearReleaseNote, clearNavigationGroup],
  )

  return (
    <Section role="dialog" aria-modal="true" className={classNames.wrapper} ref={domRef}>
      <div className={classNames.header}>
        <Cluster justify="space-between" align="center">
          {isAppLauncherSelected ? (
            <MenuSubHeading title={translated.launcherListText} onClickBack={clearAppLauncher} />
          ) : isReleaseNoteSelected ? (
            // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
            <MenuSubHeading title={translated.latestReleaseNotes} onClickBack={clearReleaseNote} />
          ) : selectedNavigationGroup ? (
            // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
            <MenuSubHeading
              title={selectedNavigationGroup.children}
              onClickBack={clearNavigationGroup}
            />
          ) : (
            tenantSelector
          )}
          <CloseButton alt={translated.closeMenu} onClick={dialogClose} />
        </Cluster>
      </div>

      {isAppLauncherSelected && features && features.length > 0 ? (
        <AppLauncher features={features} />
      ) : (
        <div className={classNames.content}>
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
}

const CloseButton = memo<{ alt: ReactNode; onClick: () => void }>(({ alt, onClick }) => (
  <Button size="s" onClick={onClick}>
    <FaXmarkIcon alt={alt} />
  </Button>
))
