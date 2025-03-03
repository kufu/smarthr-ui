import React, {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { UnstyledButton } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCircleXmarkIcon, FaStarIcon } from '../../../Icon'
import { SearchInput } from '../../../Input'
import { Cluster } from '../../../Layout'
import { Section } from '../../../SectioningContent'
import { SideNav } from '../../../SideNav'
import { TextLink } from '../../../TextLink'
import { useAppLauncher } from '../../hooks/useAppLauncher'
import { useTranslate } from '../../hooks/useTranslate'
import { Launcher } from '../../types'
import { AppLauncherFeatures } from '../common/AppLauncherFeatures'
import { AppLauncherSortDropdown } from '../common/AppLauncherSortDropdown'
import { Translate } from '../common/Translate'

type Props = {
  features: Array<Launcher['feature']>
}

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-AppLauncher',
      'shr-grid shr-grid-rows-[auto_1fr] shr-w-[38rem] shr-h-[40rem]',
    ],
    searchArea: [
      'smarthr-ui-AppLauncher-searchArea',
      'shr-p-1 shr-border-b-shorthand',
      '[&_.smarthr-ui-Input]:shr-h-[42px]',
    ],
    inner: ['smarthr-ui-AppLauncher-inner', 'shr-grid shr-grid-cols-[11rem_1fr] shr-min-h-0'],
    side: [
      'smarthr-ui-AppLauncher-side',
      'shr-flex shr-flex-col shr-pt-0.5 shr-pb-1 shr-border-r-shorthand shr-bg-column',
      '[&_hr]:shr-h-[1px] [&_hr]:shr-m-0.5 [&_hr]:shr-border-none [&_hr]:shr-bg-border',
    ],
    sideNav: [
      '[&_.smarthr-ui-SideNav-item>button]:shr-py-0.75 [&_.smarthr-ui-SideNav-item>button]:shr-px-1',
      '[&_.smarthr-ui-SideNav-item>button>span]:shr-flex-nowrap',
      '[&_.smarthr-ui-SideNav-item>button_.smarthr-ui-Icon]:shr-shrink-0 [&_.smarthr-ui-SideNav-item>button_.smarthr-ui-Icon]:shr-align-bottom',
    ],
    sideNavHeading: ['shr-py-0.75 shr-px-1 shr-text-xs shr-text-black'],
    help: ['smarthr-ui-AppLauncher-help', 'shr-mt-auto shr-px-1 shr-text-xs'],
    main: ['smarthr-ui-AppLauncher-main', 'shr-grid shr-min-h-0'],
    mainInner: ['shr-grid shr-grid-rows-[auto_1fr] shr-min-h-0'],
    contentHead: [
      'shr-min-h-[2rem] shr-py-0.75 shr-px-1',
      '[&_.smarthr-ui-Heading]:shr-text-black',
    ],
    scrollArea: ['shr-overflow-y-scroll shr-h-[509px]'],
  },
  variants: {
    noIcon: {
      true: {
        sideNav: ['[&_.smarthr-ui-SideNav-item>button]:shr-pl-1.5'],
      },
    },
    selected: {
      false: {
        sideNav: ['[&_.smarthr-ui-SideNav-item>button_.smarthr-ui-Icon]:shr-text-grey'],
      },
    },
  },
})

export const AppLauncher: FC<Props> = ({ features: baseFeatures }) => {
  const {
    features,
    page,
    mode,
    sortType,
    searchQuery,
    changePage,
    setSortType,
    onChangeSearchQuery,
    onClickClearSearchQuery,
  } = useAppLauncher(baseFeatures)

  const classNames = useMemo(() => {
    const {
      wrapper,
      searchArea,
      inner,
      side,
      sideNav,
      sideNavHeading,
      help,
      main,
      mainInner,
      contentHead,
      scrollArea,
    } = classNameGenerator()

    return {
      wrapper: wrapper(),
      searchArea: searchArea(),
      inner: inner(),
      side: side(),
      unselectedSideNav: sideNav({ selected: false }),
      selectedSideNav: sideNav({ noIcon: true, selected: true }),
      sideNavHeading: sideNavHeading(),
      help: help(),
      main: main(),
      mainInner: mainInner(),
      contentHead: contentHead(),
      scrollArea: scrollArea(),
    }
  }, [])

  const translate = useTranslate()
  const translated = useMemo<
    Record<
      Launcher['page'] | 'listText' | 'searchInputTitle' | 'helpText' | 'searchResultText',
      ReactNode
    >
  >(
    () => ({
      favorite: <Translate>{translate('Launcher/favoriteModeText')}</Translate>,
      all: <Translate>{translate('Launcher/allModeText')}</Translate>,
      listText: <Translate>{translate('Launcher/listText')}</Translate>,
      searchInputTitle: translate('Launcher/searchInputTitle'),
      helpText: <Translate>{translate('Launcher/helpText')}</Translate>,
      searchResultText: <Translate>{translate('Launcher/searchResultText')}</Translate>,
    }),
    [translate],
  )

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.searchArea}>
        <SearchInput
          name="search"
          title={translated.searchInputTitle as string}
          tooltipMessage={<Translate>{translated.searchInputTitle}</Translate>}
          width="100%"
          value={searchQuery}
          suffix={mode === 'search' && <ClearSearchButton onClick={onClickClearSearchQuery} />}
          onChange={onChangeSearchQuery}
        />
      </div>

      <div className={classNames.inner}>
        <SideNavs
          mode={mode}
          page={page}
          changePage={changePage}
          translated={translated}
          classNames={classNames}
        />
        <main className={classNames.main}>
          <Section className={classNames.mainInner}>
            <Cluster className={classNames.contentHead} align="center" justify="space-between">
              <MemoizedSubSubBlockHeading>
                {mode === 'search' ? translated.searchResultText : translated[page]}
              </MemoizedSubSubBlockHeading>

              {(mode === 'search' || page === 'all') && (
                <AppLauncherSortDropdown sortType={sortType} onSelectSortType={setSortType} />
              )}
            </Cluster>

            <div className={classNames.scrollArea}>
              <AppLauncherFeatures features={features} page={page} />
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}

const ClearSearchButton = memo<{ onClick: () => void }>(({ onClick }) => (
  <UnstyledButton onClick={onClick}>
    <FaCircleXmarkIcon />
  </UnstyledButton>
))

const SideNavs = memo<
  Pick<ReturnType<typeof useAppLauncher>, 'mode' | 'page' | 'changePage'> & {
    translated: { favorite: ReactNode; listText: ReactNode; all: ReactNode; helpText: ReactNode }
    classNames: {
      side: string
      unselectedSideNav: string
      sideNavHeading: string
      selectedSideNav: string
      help: string
    }
  }
>(({ mode, page, changePage, translated, classNames }) => {
  const isNotSearch = mode !== 'search'
  const isFavorite = isNotSearch && page === 'favorite'
  const isAll = isNotSearch && page === 'all'

  const unselectedItems = useMemo(
    () => [
      {
        id: 'favorite',
        title: translated.favorite,
        prefix: <FaStarIcon color={isFavorite ? textColor.white : undefined} />,
        isSelected: isFavorite,
      },
    ],
    [isFavorite, translated],
  )
  const selectedItems = useMemo(
    () => [
      {
        id: 'all',
        title: translated.all,
        isSelected: isAll,
      },
    ],
    [isAll, translated],
  )

  const onClick = useCallback(
    (_: any, id: string) => {
      changePage(id as Launcher['page'])
    },
    [changePage],
  )

  return (
    <div className={classNames.side}>
      <SideNav
        className={classNames.unselectedSideNav}
        size="s"
        items={unselectedItems}
        onClick={onClick}
      />

      <hr />

      <Section>
        <MemoizedSubSubBlockHeading className={classNames.sideNavHeading}>
          {translated.listText}
        </MemoizedSubSubBlockHeading>
        <SideNav
          className={classNames.selectedSideNav}
          size="s"
          items={selectedItems}
          onClick={onClick}
        />
      </Section>

      <HelpLinkArea className={classNames.help}>{translated.helpText}</HelpLinkArea>
    </div>
  )
})

const HelpLinkArea = memo<PropsWithChildren<{ className: string }>>(({ children, className }) => (
  <div className={className}>
    <TextLink
      href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
      target="_blank"
    >
      {children}
    </TextLink>
  </div>
))

const MemoizedSubSubBlockHeading = memo<PropsWithChildren<{ className?: string }>>(
  ({ children, className }) => (
    <Heading type="subSubBlockTitle" className={className}>
      {children}
    </Heading>
  ),
)
