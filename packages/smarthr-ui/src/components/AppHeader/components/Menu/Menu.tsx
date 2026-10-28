import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useEscapeCallbackRef } from '../../../../hooks/client/useEscapeCallbackRef'
import { useLatest } from '../../../../hooks/useLatest'
import { Localizer } from '../../../../intl'
import { Button } from '../../../Button'
import { FaAngleRightIcon, FaBarsIcon, FaToolboxIcon } from '../../../Icon'
import { Portal } from '../../../Portal'
import { MobileNavigation } from '../Navigation'
import { MenuButton } from '../common/MenuButton'

import { MenuAccordion } from './MenuAccordion'
import { MenuDialog, type MenuPage } from './MenuDialog'

import type { InternalHeaderProps, Navigation, NavigationGroup } from '../../types'

const classNameGenerator = tv({
  base: ['shr-border-t-shorthand shr-py-1', 'first:shr-border-t-0 first:shr-pt-0'],
})

const TOP_PAGE: MenuPage = { type: 'top' }
const LAUNCHER_PAGE: MenuPage = { type: 'launcher' }
const RELEASE_NOTE_PAGE: MenuPage = { type: 'releaseNote' }

let scrollPosition = 0

type Props = Pick<
  InternalHeaderProps,
  | 'appName'
  | 'features'
  | 'isAppLauncherAvailable'
  | 'featuresLoading'
  | 'featuresError'
  | 'handleOpenAppLauncher'
  | 'releaseNote'
> & {
  navigations: Navigation[]
  tenantSelector: ReactNode
  additionalContent: ReactNode
}

export const Menu: FC<Props> = ({
  appName,
  navigations,
  features,
  isAppLauncherAvailable,
  featuresLoading,
  featuresError,
  handleOpenAppLauncher,
  releaseNote,
  tenantSelector,
  additionalContent,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  // HINT: メニュー内で表示しているページ。トップ以外（アプリ一覧・リリースノート・ナビゲーションのグループ）では戻るボタンを表示する
  const [page, setPage] = useState<MenuPage>(TOP_PAGE)

  const latest = useLatest({ handleOpenAppLauncher })

  const functions = useMemo(
    () => ({
      handleOpen: () => setIsOpen(true),
      handleClose: () => setIsOpen(false),
      handleOpenLauncher: () => {
        latest.handleOpenAppLauncher()
        setPage(LAUNCHER_PAGE)
      },
      handleOpenReleaseNote: () => setPage(RELEASE_NOTE_PAGE),
      handleOpenNavigationGroup: (navigation: NavigationGroup) =>
        setPage({ type: 'navigationGroup', navigation }),
      handleBackToTop: () => setPage(TOP_PAGE),
    }),
    [latest],
  )

  useEffect(() => {
    if (isOpen) {
      scrollPosition = window.scrollY
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setTimeout(() => window.scrollTo(0, scrollPosition), 0)
    }
  }, [isOpen])

  const callbackRef = useEscapeCallbackRef(functions.handleClose)

  const className = useMemo(() => classNameGenerator(), [])

  return (
    <>
      <OpenButton
        alt={
          <Localizer id="smarthr-ui/AppHeader/MobileHeader/openMenu" defaultText="メニューを開く" />
        }
        onClick={functions.handleOpen}
      />
      <Portal>
        <MenuDialog
          callbackRef={callbackRef}
          isOpen={isOpen}
          page={page}
          features={features}
          isAppLauncherAvailable={isAppLauncherAvailable}
          featuresLoading={featuresLoading}
          featuresError={featuresError}
          releaseNote={releaseNote}
          tenantSelector={tenantSelector}
          handleClose={functions.handleClose}
          handleBackToTop={functions.handleBackToTop}
          handleOpenNavigationGroup={functions.handleOpenNavigationGroup}
        >
          {isAppLauncherAvailable && (
            <FeatureButton className={className} handleClick={functions.handleOpenLauncher}>
              <Localizer id="smarthr-ui/AppHeader/Launcher/listText" defaultText="アプリ一覧" />
            </FeatureButton>
          )}
          <NavigationAccordion
            appName={appName}
            navigations={navigations}
            className={className}
            handleClickNavigation={functions.handleClose}
            handleOpenNavigationGroup={functions.handleOpenNavigationGroup}
          />
          {additionalContent && (
            <AdditionalContent
              title={
                <Localizer
                  id="smarthr-ui/AppHeader/MobileHeader/managementMenu"
                  defaultText="管理メニュー"
                />
              }
              className={className}
            >
              {additionalContent}
            </AdditionalContent>
          )}
          {releaseNote && (
            <ReleaseNoteButton className={className} handleClick={functions.handleOpenReleaseNote}>
              <Localizer id="smarthr-ui/AppHeader/releaseNotes" defaultText="リリースノート" />
            </ReleaseNoteButton>
          )}
        </MenuDialog>
      </Portal>
    </>
  )
}

const OpenButton = memo<{ alt: ReactNode; onClick: () => void }>(({ onClick, alt }) => (
  <Button size="S" aria-haspopup="true" onClick={onClick}>
    <FaBarsIcon alt={alt} />
  </Button>
))

const FeatureButton = memo<PropsWithChildren<{ className: string; handleClick: () => void }>>(
  ({ handleClick, children, className }) => (
    <div className={className}>
      <Button
        wide
        onClick={handleClick}
        prefix={<FaToolboxIcon />}
        suffix={<FaAngleRightIcon className="shr-ms-auto" />}
      >
        {children}
      </Button>
    </div>
  ),
)

const NavigationAccordion = memo<
  Pick<Props, 'appName' | 'navigations'> & {
    className: string
    handleClickNavigation: () => void
    handleOpenNavigationGroup: (navigation: NavigationGroup) => void
  }
>(({ appName, navigations, className, handleClickNavigation, handleOpenNavigationGroup }) => {
  const children = (
    <MobileNavigation
      navigations={navigations}
      handleClickNavigation={handleClickNavigation}
      handleOpenNavigationGroup={handleOpenNavigationGroup}
    />
  )

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
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={className}>
      <MenuAccordion isOpen={isOpen} title={appName} setIsOpen={setIsOpen}>
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
      <MenuAccordion isOpen={isOpen} title={title} setIsOpen={setIsOpen}>
        {children}
      </MenuAccordion>
    </div>
  )
}

const ReleaseNoteButton = memo<PropsWithChildren<{ className: string; handleClick: () => void }>>(
  ({ handleClick, children, className }) => (
    <div className={className}>
      <MenuButton handleClick={handleClick}>{children}</MenuButton>
    </div>
  ),
)
