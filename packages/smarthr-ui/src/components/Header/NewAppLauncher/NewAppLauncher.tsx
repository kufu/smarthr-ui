import React, { HTMLAttributes, ReactNode, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { AnchorButton, Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../Dropdown'
import { Heading } from '../../Heading'
import { FaArrowRightIcon, FaCaretDownIcon, FaStarIcon, FaToolboxIcon } from '../../Icon'
import { SearchInput } from '../../Input'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { SideNav } from '../../SideNav'

import { SortDropdown } from './SortDropdown'
import { useAppLauncher } from './useAppLauncher'

import type { DecoratorsType } from '../../../types'

type Category = {
  type?: string
  heading: ReactNode
  items: AppItem[]
}
type AppItem = {
  label: ReactNode
  url: string
  target?: string
}
type Props = {
  apps: Category[]
  urlToShowAll?: string | null
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'triggerLabel'>
} & VariantProps<typeof appLauncher>
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

const TRIGGER_LABEL = 'アプリ'

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
      'shr-py-0.5 shr-border-r-shorthand shr-bg-column',
      '[&_hr]:shr-h-[1px] [&_hr]:shr-m-0.5 [&_hr]:shr-border-none [&_hr]:shr-bg-border',
    ],
    sideNav: [
      '[&_.smarthr-ui-SideNav-item>button]:shr-py-0.75 [&_.smarthr-ui-SideNav-item>button]:shr-px-1',
      '[&_.smarthr-ui-SideNav-item>button>span]:shr-flex-nowrap',
      '[&_.smarthr-ui-SideNav-item>button_.smarthr-ui-Icon]:shr-shrink-0 [&_.smarthr-ui-SideNav-item>button_.smarthr-ui-Icon]:shr-align-bottom',
    ],
    sideNavHeading: ['shr-py-0.75 shr-px-1 shr-text-xs shr-text-black'],
    main: ['smarthr-ui-AppLauncher-main', 'shr-grid shr-min-h-0'],
    mainInner: ['shr-grid shr-grid-rows-[auto_1fr] shr-min-h-0'],
    contentHead: [
      'shr-min-h-[2rem] shr-py-0.75 shr-px-1',
      '[&_.smarthr-ui-Heading]:shr-text-black',
    ],
    list: ['shr-list-none'],
    listItem: [
      'smarthr-ui-AppLauncher-listItem',
      'shr-grid shr-grid-cols-[1rem_1fr_1rem] shr-gap-0.75 shr-min-h-[2.5rem] shr-px-1.5 shr-leading-tight shr-text-left shr-whitespace-nowrap',
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
  },
})

export const NewAppLauncher: React.FC<Props & ElementProps> = ({
  apps,
  urlToShowAll,
  decorators,
  enableNew,
  ...props
}) => {
  const { hoge } = useAppLauncher()
  console.log(hoge)

  const triggerLabel = useMemo(
    () => decorators?.triggerLabel?.(TRIGGER_LABEL) || TRIGGER_LABEL,
    [decorators],
  )

  const {
    appsButton,
    contentWrapper,
    searchArea,
    inner,
    side,
    sideNav,
    sideNavHeading,
    main,
    mainInner,
    contentHead,
    list,
    listItem,
  } = appLauncher({
    enableNew,
  })

  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <Button
          prefix={enableNew ?? <FaToolboxIcon />}
          suffix={enableNew ? <FaCaretDownIcon /> : undefined}
          className={appsButton()}
        >
          {triggerLabel}
        </Button>
      </DropdownTrigger>

      <DropdownContent controllable>
        <div className={contentWrapper()}>
          <div className={searchArea()}>
            <SearchInput
              type="search"
              name="search"
              title="アプリ名を入力してください。"
              tooltipMessage="アプリ名を入力してください。"
              width="100%"
              // // value={searchQuery}
              // suffix={
              //   searchQuery && (
              //     <SearchClearButton onClick={() => onChangeSearchQuery('')}>
              //       <FaCircleXmarkIcon />
              //     </SearchClearButton>
              //   )
              // }
              // onChange={(e) => onChangeSearchQuery(e.target.value)}
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
                    title: 'よく使うアプリ',
                    // prefix: <FaStarIcon color={page === 'favorite' && mode !== 'search' ? theme.color.WHITE : undefined} />,
                    prefix: <FaStarIcon />,
                    // isSelected: page === 'favorite' && mode !== 'search',
                    isSelected: false,
                  },
                ]}
              />

              <hr />

              <Section>
                <Heading className={sideNavHeading()} type="subSubBlockTitle">
                  アプリ一覧
                </Heading>

                <SideNav
                  className={sideNav({ noIcon: true, selected: true })}
                  size="s"
                  items={[
                    {
                      id: 'all',
                      title: 'すべてのアプリ',
                      // isSelected: page === 'all' && mode !== 'search',
                      isSelected: true,
                    },
                  ]}
                />
              </Section>
            </div>

            <main className={main()}>
              <Section className={mainInner()}>
                <Cluster className={contentHead()} align="center" justify="space-between">
                  <Heading type="subSubBlockTitle">すべてのアプリ</Heading>

                  <SortDropdown />
                </Cluster>

                <ul className={list()}>
                  <li>
                    <AnchorButton
                      className={listItem()}
                      variant="text"
                      href="https://example.com"
                      prefix={<FaStarIcon />}
                      suffix={<FaArrowRightIcon />}
                      wide
                      target="_blank"
                    >
                      機能1
                    </AnchorButton>
                  </li>

                  <li>
                    <AnchorButton
                      className={listItem()}
                      variant="text"
                      href="https://example.com"
                      prefix={<FaStarIcon />}
                      suffix={<FaArrowRightIcon />}
                      wide
                      target="_blank"
                    >
                      機能2
                    </AnchorButton>
                  </li>

                  <li>
                    <AnchorButton
                      className={listItem()}
                      variant="text"
                      href="https://example.com"
                      prefix={<FaStarIcon />}
                      suffix={<FaArrowRightIcon />}
                      wide
                      target="_blank"
                    >
                      機能3
                    </AnchorButton>
                  </li>
                </ul>
              </Section>
            </main>
          </div>
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
