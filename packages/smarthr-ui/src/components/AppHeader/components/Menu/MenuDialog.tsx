import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  type RefCallback,
  type RefObject,
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
import { MobileLauncher } from '../Launcher'
import { MobileNavigation } from '../Navigation'
import { MobileReleaseNote } from '../ReleaseNote'

import { MenuSubHeading } from './MenuSubHeading'

import type { InternalHeaderProps, NavigationGroup } from '../../types'

export type MenuPage =
  | { type: 'top' }
  | { type: 'launcher' }
  | { type: 'releaseNote' }
  | { type: 'navigationGroup'; navigation: NavigationGroup }

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
  // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
  const { wrapper, header, content } = classNameGenerator()

  return {
    wrapper: wrapper(),
    header: header(),
    content: content(),
  }
})()

type Props = PropsWithChildren<
  Pick<
    InternalHeaderProps,
    'features' | 'isAppLauncherAvailable' | 'featuresLoading' | 'featuresError' | 'releaseNote'
  > & {
    callbackRef: RefCallback<HTMLElement>
    isOpen: boolean
    page: MenuPage
    tenantSelector: ReactNode
    handleClose: () => void
    handleBackToTop: () => void
    handleOpenNavigationGroup: (navigation: NavigationGroup) => void
  }
>

export const MenuDialog: FC<Props> = ({ callbackRef, isOpen, ...rest }) => {
  const domRef = useRef<HTMLSelectElement>(null)

  return (
    <CSSTransition
      nodeRef={domRef}
      in={isOpen}
      timeout={300}
      unmountOnExit
      classNames="shr-sp-menu"
    >
      <div ref={callbackRef} className="shr-fixed shr-z-overlap-base">
        <FocusTrap>
          <Content {...rest} domRef={domRef} />
        </FocusTrap>
      </div>
    </CSSTransition>
  )
}

const Content: FC<
  Omit<Props, 'callbackRef' | 'isOpen'> & {
    domRef: RefObject<HTMLSelectElement>
  }
> = ({
  domRef,
  children,
  page,
  features,
  isAppLauncherAvailable,
  featuresLoading,
  featuresError,
  releaseNote,
  tenantSelector,
  handleClose,
  handleBackToTop,
  handleOpenNavigationGroup,
}) => {
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

  const latest = useLatest({ handleBackToTop })

  const functions = useMemo(
    () => ({
      // HINT: Contentをanimationで非表示にしたい
      // アニメーションが終われば、CSSTransitionのchildrenはunmountされるため、
      // unmount時に表示中のページをトップに戻す
      callbackRef: () => () => {
        latest.handleBackToTop()
      },
    }),
    [latest],
  )

  const mergedRef = useMergeRefs(functions.callbackRef, domRef)

  return (
    <Section ref={mergedRef} role="dialog" className={CLASS_NAMES.wrapper} aria-modal="true">
      <div className={CLASS_NAMES.header}>
        <Cluster justify="space-between" align="center">
          {page.type === 'launcher' ? (
            <MenuSubHeading title={translated.launcherListText} handleClickBack={handleBackToTop} />
          ) : page.type === 'releaseNote' ? (
            // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
            <MenuSubHeading
              title={translated.latestReleaseNotes}
              handleClickBack={handleBackToTop}
            />
          ) : page.type === 'navigationGroup' ? (
            // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
            <MenuSubHeading title={page.navigation.children} handleClickBack={handleBackToTop} />
          ) : (
            <div>{tenantSelector}</div>
          )}

          <Button size="S" onClick={handleClose}>
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

      {page.type === 'launcher' && isAppLauncherAvailable ? (
        <MobileLauncher features={features} loading={featuresLoading} error={featuresError} />
      ) : (
        <Scroller direction="vertical" className={CLASS_NAMES.content}>
          {page.type === 'releaseNote' ? (
            releaseNote && <MobileReleaseNote {...releaseNote} />
          ) : page.type === 'navigationGroup' ? (
            <MobileNavigation
              navigations={page.navigation.childNavigations}
              handleClickNavigation={handleClose}
              handleOpenNavigationGroup={handleOpenNavigationGroup}
            />
          ) : (
            children
          )}
        </Scroller>
      )}
    </Section>
  )
}
