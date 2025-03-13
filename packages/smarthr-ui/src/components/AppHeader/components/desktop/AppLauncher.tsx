import React, { type FC, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../..'
import { Localizer } from '../../../../intl/Localizer'
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
import { AppLauncherFeatures } from '../common/AppLauncherFeatures'
import { AppLauncherSortDropdown } from '../common/AppLauncherSortDropdown'

import type { Launcher } from '../../types'

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
  const { localize } = useIntl()
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

  const pageMap: Record<Launcher['page'], ReactNode> = {
    favorite: (
      <Localizer
        id="smarthr-ui/AppHeader/favoriteModeText"
        defaultText="よく使うアプリ"
        values={{}}
      />
    ),
    all: (
      <Localizer id="smarthr-ui/AppHeader/allModeText" defaultText="すべてのアプリ" values={{}} />
    ),
  }

  return (
    <div className={wrapper()}>
      <div className={searchArea()}>
        <SearchInput
          name="search"
          title={localize({
            id: 'smarthr-ui/AppHeader/searchInputTitle',
            defaultText: 'アプリ名を入力してください。',
          })}
          tooltipMessage={
            <Localizer
              id="smarthr-ui/AppHeader/searchInputTitle"
              defaultText="アプリ名を入力してください。"
              values={{}}
            />
          }
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

      <div className={inner()}>
        <div className={side()}>
          <SideNav
            className={sideNav({ selected: false })}
            size="s"
            items={[
              {
                id: 'favorite',
                title: pageMap.favorite,
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
            <Heading className={sideNavHeading()} type="subSubBlockTitle">
              <Localizer id="smarthr-ui/AppHeader/listText" defaultText="アプリ一覧" values={{}} />
            </Heading>

            <SideNav
              className={sideNav({ noIcon: true, selected: true })}
              size="s"
              items={[
                {
                  id: 'all',
                  title: pageMap.all,
                  isSelected: mode !== 'search' && page === 'all',
                },
              ]}
              onClick={(_, id) => {
                changePage(id as Launcher['page'])
              }}
            />
          </Section>

          <div className={help()}>
            {/* eslint-disable-next-line smarthr/a11y-clickable-element-has-text */}
            <TextLink
              href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
              target="_blank"
            >
              <Localizer
                id="smarthr-ui/AppHeader/helpText"
                defaultText="よく使うアプリとは"
                values={{}}
              />
            </TextLink>
          </div>
        </div>

        <main className={main()}>
          <Section className={mainInner()}>
            <Cluster className={contentHead()} align="center" justify="space-between">
              <Heading type="subSubBlockTitle">
                {mode === 'search' ? (
                  <Localizer
                    id="smarthr-ui/AppHeader/searchResultText"
                    defaultText="検索結果"
                    values={{}}
                  />
                ) : (
                  pageMap[page]
                )}
              </Heading>

              {(mode === 'search' || page === 'all') && (
                <AppLauncherSortDropdown
                  sortType={sortType}
                  onSelectSortType={(value) => setSortType(value)}
                />
              )}
            </Cluster>

            <div className={scrollArea()}>
              <AppLauncherFeatures features={features} page={page} />
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}
