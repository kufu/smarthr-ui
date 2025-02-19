import React, { type FC, type ReactNode, useMemo } from 'react'
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

const appLauncher = tv({
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
    changeSearchQuery,
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
    } = appLauncher()

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
          title={translated.searchInputTitle}
          tooltipMessage={<Translate>{translated.searchInputTitle}</Translate>}
          width="100%"
          value={searchQuery}
          suffix={
            mode === 'search' && (
              <UnstyledButton
                onClick={() => {
                  // 別のキューにしないとドロップダウンが閉じてしまう
                  setTimeout(() => {
                    changeSearchQuery('')
                  }, 0)
                }}
              >
                <FaCircleXmarkIcon />
              </UnstyledButton>
            )
          }
          onChange={(e) => changeSearchQuery(e.target.value)}
        />
      </div>

      <div className={classNames.inner}>
        <div className={classNames.side}>
          <SideNav
            className={classNames.unselectedSideNav}
            size="s"
            items={[
              {
                id: 'favorite',
                title: translated.favorite,
                prefix: (
                  <FaStarIcon
                    color={mode !== 'search' && page === 'favorite' ? textColor.white : undefined}
                  />
                ),
                isSelected: mode !== 'search' && page === 'favorite',
              },
            ]}
            onClick={(_, id) => {
              changePage(id as Launcher['page'])
            }}
          />

          <hr />

          <Section>
            <Heading className={classNames.sideNavHeading} type="subSubBlockTitle">
              {translated.listText}
            </Heading>

            <SideNav
              className={classNames.selectedSideNav}
              size="s"
              items={[
                {
                  id: 'all',
                  title: translated.all,
                  isSelected: mode !== 'search' && page === 'all',
                },
              ]}
              onClick={(_, id) => {
                changePage(id as Launcher['page'])
              }}
            />
          </Section>

          <div className={classNames.help}>
            <TextLink
              href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
              target="_blank"
            >
              {translated.helpText}
            </TextLink>
          </div>
        </div>

        <main className={classNames.main}>
          <Section className={classNames.mainInner}>
            <Cluster className={classNames.contentHead} align="center" justify="space-between">
              <Heading type="subSubBlockTitle">
                {mode === 'search' ? translated.searchResultText : translated[page]}
              </Heading>

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
