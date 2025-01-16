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

  const calculatedApps = useMemo(() => {
    const result: {
      base: Props['apps'][number]
      others: Props['apps']
    } = { base: undefined, others: [] }

    apps.forEach((app) => {
      if (app.type === 'base') {
        result.base = app
      } else {
        result.others.push(app)
      }
    })

    return result
  }, [apps])

  const styles = useMemo(() => {
    const { appsButton, contentWrapper, category, appList, link, footer } = appLauncher({
      enableNew,
    })

    return {
      appsButton: appsButton(),
      contentWrapper: contentWrapper(),
      category: category(),
      appList: appList(),
      link: link(),
      footer: footer(),
    }
  }, [enableNew])

  return (
    <Dropdown {...props}>
      <DropdownTrigger>
        <Button
          prefix={enableNew ?? <FaToolboxIcon />}
          suffix={enableNew ? <FaCaretDownIcon /> : undefined}
          className={styles.appsButton}
        >
          {triggerLabel}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Stack as="nav" gap={1.5} className={styles.contentWrapper}>
          <Stack gap={1.5}>
            {calculatedApps.base && (
              <Stack gap={0.5} className={styles.category} as="section">
                <Heading type="subSubBlockTitle">{calculatedApps.base.heading}</Heading>
                {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
                <Cluster as="ul" gap={1} className={styles.appList}>
                  {calculatedApps.base.items.map((item) => (
                    <LinkListItem key={item.label} item={item} className={styles.link} />
                  ))}
                </Cluster>
              </Stack>
            )}
            <Cluster gap={1.5}>
              {calculatedApps.others.map(({ heading, items }, i) => (
                <Stack key={i} gap={0.5} className={styles.category} as="section">
                  <Heading type="subSubBlockTitle">{heading}</Heading>
                  {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
                  <Stack gap={0.5} as="ul" className={styles.appList}>
                    {items.map((item) => (
                      <LinkListItem key={item.label} item={item} className={styles.link} />
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Cluster>
          </Stack>
          <TextLinkToShowAll href={urlToShowAll} className={styles.footer} />
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}

const TextLinkToShowAll = React.memo<{ href: string; className: string }>(
  ({ href, className }) =>
    href && (
      <div className={className}>
        <TextLink href={href} style={{ width: 'fit-content' }}>
          すべて見る
        </TextLink>
      </div>
    ),
)

const LinkListItem: React.FC<{ item: AppItem; className: string }> = ({ item, className }) => (
  <li>
    <TextLink href={item.url} target={item.target} className={className}>
      {item.label}
    </TextLink>
  </li>
)
