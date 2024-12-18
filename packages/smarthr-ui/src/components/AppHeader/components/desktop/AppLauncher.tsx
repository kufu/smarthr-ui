import React, { FC, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { textColor } from '../../../../themes'
import { AnchorButton, Button, UnstyledButton } from '../../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../../Dropdown'
import { Heading } from '../../../Heading'
import {
  FaArrowRightIcon,
  FaCaretDownIcon,
  FaCircleXmarkIcon,
  FaStarIcon,
  FaToolboxIcon,
} from '../../../Icon'
import { SearchInput } from '../../../Input'
import { Cluster } from '../../../Layout'
import { LineClamp } from '../../../LineClamp'
import { Section } from '../../../SectioningContent'
import { SideNav } from '../../../SideNav'
import { Text } from '../../../Text'
import { TextLink } from '../../../TextLink'
import { useAppLauncher } from '../../hooks/useAppLauncher'
import { useTranslate } from '../../hooks/useTranslate'
import { Launcher } from '../../types'
import { Translate } from '../common/Translate'

import { AppLauncherSortDropdown } from './AppLauncherSortDropdown'

type Props = {
  /** 機能一覧 */
  features: Array<Launcher['feature']>
  /** 新しいデザインを適用するかどうか */
  enableNew?: boolean
}

const appLauncher = tv({
  slots: {
    appsButton: [
      'shr-border-none shr-font-normal shr-text-white shr-bg-transparent shr-px-0.25',
      'hover:shr-border-transparent hover:shr-bg-transparent',
      'focus-visible:shr-border-transparent focus-visible:shr-bg-transparent',
      'forced-colors:shr-border-shorthand',
    ],
    contentWrapper: [
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
    list: ['shr-list-none', '[&>li]:shr-px-0.5 [&>li]:shr-py-0.25'],
    listEmpty: ['shr-p-1 shr-text-center'],
    listItem: [
      'smarthr-ui-AppLauncher-listItem',
      'shr-grid shr-grid-cols-[1rem_1fr_1rem] shr-gap-0.75 shr-min-h-[2.5rem] shr-px-1 shr-py-0 shr-leading-tight shr-text-left shr-whitespace-normal',
    ],
  },
  variants: {
    enableNew: {
      true: {
        appsButton: [
          'shr-px-0.5 shr-font-bold shr-text-black',
          '[&_>_svg]:aria-expanded:shr-rotate-180',
          'hover:shr-bg-white-darken',
          'focus-visible:shr-bg-white-darken',
        ],
      },
    },
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
    favorite: {
      false: {
        listItem: ['shr-grid-cols-[1fr_1rem]'],
      },
    },
  },
})

export const AppLauncher: FC<Props> = ({ features: baseFeatures, enableNew }) => {
  const translate = useTranslate()
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
    appsButton,
    contentWrapper,
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
    list,
    listEmpty,
    listItem,
  } = appLauncher({
    enableNew,
  })

  const pageMap: Record<Launcher['page'], ReactNode> = {
    favorite: <Translate>{translate('Launcher/favoriteModeText')}</Translate>,
    all: <Translate>{translate('Launcher/allModeText')}</Translate>,
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          prefix={enableNew ?? <FaToolboxIcon />}
          suffix={enableNew ?? <FaCaretDownIcon />}
          className={appsButton()}
        >
          <Translate>{translate('DesktopHeader/DesktopHeader/appLauncherLabel')}</Translate>
        </Button>
      </DropdownTrigger>

      <DropdownContent controllable>
        <div className={contentWrapper()}>
          <div className={searchArea()}>
            <SearchInput
              name="search"
              title={translate('Launcher/searchInputTitle')}
              tooltipMessage={<Translate>{translate('Launcher/searchInputTitle')}</Translate>}
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
                        color={
                          mode !== 'search' && page === 'favorite' ? textColor.white : undefined
                        }
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
                  <Translate>{translate('Launcher/listText')}</Translate>
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
                <TextLink
                  href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
                  target="_blank"
                >
                  <Translate>{translate('Launcher/helpText')}</Translate>
                </TextLink>
              </div>
            </div>

            <main className={main()}>
              <Section className={mainInner()}>
                <Cluster className={contentHead()} align="center" justify="space-between">
                  <Heading type="subSubBlockTitle">
                    {mode === 'search' ? (
                      <Translate>{translate('Launcher/searchResultText')}</Translate>
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
                  <ul className={list()}>
                    {features.length === 0 ? (
                      <div className={listEmpty()}>
                        <Text size="S">
                          <Translate>{translate('Launcher/emptyText')}</Translate>
                        </Text>
                      </div>
                    ) : (
                      features.map((feature) => (
                        <li key={feature.id}>
                          <AnchorButton
                            className={listItem({ favorite: page === 'favorite' })}
                            variant="text"
                            href={feature.url}
                            prefix={page === 'favorite' && <FaStarIcon />}
                            suffix={<FaArrowRightIcon />}
                            wide
                            target="_blank"
                          >
                            <LineClamp maxLines={2}>{feature.name}</LineClamp>
                          </AnchorButton>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </Section>
            </main>
          </div>
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
