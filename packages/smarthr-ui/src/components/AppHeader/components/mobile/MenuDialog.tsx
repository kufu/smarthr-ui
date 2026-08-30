import {
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  useContext,
  useMemo,
  useRef,
} from 'react'
import { CSSTransition } from 'react-transition-group'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'
import { Localizer, useLocalize } from '../../../../intl'
import { Button } from '../../../Button'
import { FocusTrap } from '../../../Dialog'
import { FaXmarkIcon } from '../../../Icon'
import { Cluster } from '../../../Layout'
import { Scroller } from '../../../Scroller'
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
    content: 'shr-p-1',
  },
})

const CLASS_NAMES = (() => {
  const { wrapper, header, content } = classNameGenerator()

  return {
    wrapper: wrapper(),
    header: header(),
    content: content(),
  }
})()

type Props = PropsWithChildren<{
  isOpen: boolean
  setIsOpen: Dispatch<boolean>
  tenantSelector: ReactNode
}>

export const MenuDialog: FC<Props> = ({ isOpen, ...rest }) => {
  const domRef = useRef<HTMLSelectElement>(null)

  return (
    <CSSTransition
      nodeRef={domRef}
      in={isOpen}
      timeout={300}
      unmountOnExit
      classNames="shr-sp-menu"
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
  const {
    features,
    isAppLauncherAvailable,
    featuresLoading,
    featuresError,
    isAppLauncherSelected,
    setIsAppLauncherSelected,
  } = useContext(AppLauncherContext)

  const translated = useLocalize({
    launcherListText: {
      id: 'smarthr-ui/AppHeader/Launcher/listText',
      defaultText: 'アプリ一覧',
    },
    latestReleaseNotes: {
      id: 'smarthr-ui/AppHeader/MobileHeader/latestReleaseNotes',
      defaultText: '最新のリリースノート',
    },
  })

  const latest = useLatest({
    setIsOpen,
    setIsAppLauncherSelected,
    setIsReleaseNoteSelected,
    setSelectedNavigationGroup,
  })

  const functions = useMemo(() => {
    const clearAppLauncher = () => latest.setIsAppLauncherSelected(false)
    const clearReleaseNote = () => latest.setIsReleaseNoteSelected(false)
    const clearNavigationGroup = () => latest.setSelectedNavigationGroup(null)

    return {
      // HINT: Contentをanimationで非表示にしたい
      // アニメーションが終われば、CSSTransitionのchildrenはunmountされるため、
      // unmount時に操作内容のclearを行う
      // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
      // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
      callbackRef: () => () => {
        clearReleaseNote()
        clearAppLauncher()
        clearNavigationGroup()
      },
      clearAppLauncher,
      clearReleaseNote,
      clearNavigationGroup,
      handleDialogClose: () => latest.setIsOpen(false),
    }
  }, [latest])

  // HINT: useMergeRefsはv18でもcallbackRefのcleanup関数に対応している
  // もしuseMergeRefsをなくす場合、react v18対応が不要になっているかどうか確認する
  const mergedRef = useMergeRefs(functions.callbackRef, domRef)

  return (
    <Section ref={mergedRef} role="dialog" className={CLASS_NAMES.wrapper} aria-modal="true">
      <div className={CLASS_NAMES.header}>
        <Cluster justify="space-between" align="center">
          {isAppLauncherSelected ? (
            <MenuSubHeading
              title={translated.launcherListText}
              handleClickBack={functions.clearAppLauncher}
            />
          ) : isReleaseNoteSelected ? (
            // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
            <MenuSubHeading
              title={translated.latestReleaseNotes}
              handleClickBack={functions.clearReleaseNote}
            />
          ) : selectedNavigationGroup ? (
            // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
            <MenuSubHeading
              title={selectedNavigationGroup.children}
              handleClickBack={functions.clearNavigationGroup}
            />
          ) : (
            <div>{tenantSelector}</div>
          )}

          <Button variant="secondary" size="S" onClick={functions.handleDialogClose}>
            <FaXmarkIcon
              alt={
                <Localizer
                  id="smarthr-ui/AppHeader/MobileHeader/closeMenu"
                  defaultText="メニューを閉じる"
                />
              }
            />
          </Button>
        </Cluster>
      </div>

      {isAppLauncherSelected && isAppLauncherAvailable ? (
        <AppLauncher features={features} loading={featuresLoading} error={featuresError} />
      ) : (
        <Scroller direction="vertical" className={CLASS_NAMES.content}>
          {isReleaseNoteSelected ? (
            <ReleaseNote />
          ) : selectedNavigationGroup ? (
            <Navigation
              navigations={selectedNavigationGroup.childNavigations}
              handleClickNavigation={functions.handleDialogClose}
            />
          ) : (
            children
          )}
        </Scroller>
      )}
    </Section>
  )
}
