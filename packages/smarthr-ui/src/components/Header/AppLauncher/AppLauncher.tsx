import React, { HTMLAttributes, ReactNode, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../Dropdown'
import { Heading } from '../../Heading'
import { FaCaretDownIcon, FaToolboxIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { TextLink } from '../../TextLink'

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
    contentWrapper: ['smarthr-ui-AppLauncher', 'shr-p-1.5 shr-leading-normal'],
    category: 'smarthr-ui-AppLauncher-category',
    appList: 'shr-list-none',
    link: 'smarthr-ui-AppLauncher-link',
    footer: [
      'smarthr-ui-AppLauncher-footer',
      'shr-border-t-shorthand -shr-mx-0.75 shr-px-0.75 shr-pt-1 -shr-mb-0.25',
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
  },
})

export const AppLauncher: React.FC<Props & ElementProps> = ({
  apps,
  urlToShowAll,
  decorators,
  enableNew,
  ...props
}) => {
  const triggerLabel = useMemo(
    () => decorators?.triggerLabel?.(TRIGGER_LABEL) || TRIGGER_LABEL,
    [decorators],
  )

  const baseApps = apps.find(({ type }) => type === 'base')
  const others = apps.filter((category) => category !== baseApps)

  const { appsButton, contentWrapper, category, appList, link, footer } = appLauncher({ enableNew })

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
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Stack as="nav" gap={1.5} className={contentWrapper()}>
          <Stack gap={1.5}>
            {baseApps && (
              <Section>
                <Stack gap={0.5} className={category()}>
                  <Heading type="subSubBlockTitle">{baseApps.heading}</Heading>
                  {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
                  <Cluster as="ul" gap={1} className={appList()}>
                    {appItems(baseApps.items, link())}
                  </Cluster>
                </Stack>
              </Section>
            )}
            <Cluster gap={1.5}>
              {others.map(({ heading, items }, i) => (
                <Section key={i}>
                  <Stack gap={0.5} className={category()}>
                    <Heading type="subSubBlockTitle">{heading}</Heading>
                    {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
                    <Stack gap={0.5} as="ul" className={appList()}>
                      {appItems(items, link())}
                    </Stack>
                  </Stack>
                </Section>
              ))}
            </Cluster>
          </Stack>

          {urlToShowAll && (
            <div className={footer()}>
              <TextLink href={urlToShowAll} style={{ width: 'fit-content' }}>
                すべて見る
              </TextLink>
            </div>
          )}
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}

const appItems = (items: AppItem[], linkStyle: string) =>
  items.map((item, index) => (
    <li key={index}>
      <TextLink href={item.url} target={item.target} className={linkStyle}>
        {item.label}
      </TextLink>
    </li>
  ))
