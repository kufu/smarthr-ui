import {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { Button } from '../../../Button'
import { FocusTrap } from '../../../Dialog/FocusTrap'
import { FaXmarkIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Section } from '../../../SectioningContent'

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
      'shr-fixed shr-left-0 shr-top-0 shr-flex shr-h-full shr-w-full shr-flex-col shr-bg-white',
      'shr-translate-opacity shr-opacity-0 shr-duration-150',
      '[&&.shr-sp-menu-enter-active]:shr-opacity-100',
      '[&&.shr-sp-menu-enter-done]:shr-opacity-100',
      '[&&.shr-sp-menu-exit-active]:shr-opacity-0',
      '[&&.shr-sp-menu-exit-done]:shr-opacity-0',
    ],
    header: 'shr-border-b-shorthand shr-sticky shr-top-0 shr-px-0.75 shr-py-0.5',
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

export const Content: FC<
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

  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      launcherListText: localize({
        id: 'smarthr-ui/AppHeader/Launcher/listText',
        defaultText: 'アプリ一覧',
      }),
      latestReleaseNotes: localize({
        id: 'smarthr-ui/AppHeader/MobileHeader/latestReleaseNotes',
        defaultText: '最新のリリースノート',
      }),
      closeMenu: localize({
        id: 'smarthr-ui/AppHeader/MobileHeader/closeMenu',
        defaultText: 'メニューを閉じる',
      }),
    }),
    [localize],
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
            <div>{tenantSelector}</div>
          )}

          <Button variant="secondary" size="s" onClick={dialogClose}>
            <FaXmarkIcon alt={translated.closeMenu} />
          </Button>
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
