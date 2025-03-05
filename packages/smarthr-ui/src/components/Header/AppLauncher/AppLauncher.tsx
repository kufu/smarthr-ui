import React, { type FC, type HTMLAttributes, type ReactNode, memo, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { type DecoratorsType } from '../../../hooks/useDecorators'
import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../Dropdown'
import { Heading } from '../../Heading'
import { FaCaretDownIcon, FaToolboxIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { TextLink } from '../../TextLink'

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
} & VariantProps<typeof classNameGenerator>
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

const TRIGGER_LABEL = 'アプリ'

const classNameGenerator = tv({
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

export const AppLauncher: FC<Props & ElementProps> = ({
  apps,
  urlToShowAll,
  decorators,
  enableNew,
  ...props
}) => {
  const calculatedApps = useMemo(() => {
    const result: {
      base: Props['apps'][number] | undefined
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

  const classNames = useMemo(() => {
    const { appsButton, contentWrapper, category, appList, link, footer } = classNameGenerator({
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
      <MemoizedDropdownTrigger
        enableNew={enableNew}
        decorators={decorators}
        className={classNames.appsButton}
      />
      <DropdownContent controllable>
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Stack as="nav" gap={1.5} className={classNames.contentWrapper}>
          <Stack gap={1.5}>
            {calculatedApps.base && (
              <Stack gap={0.5} className={classNames.category} as="section">
                <Heading type="subSubBlockTitle">{calculatedApps.base.heading}</Heading>
                <Cluster as="ul" gap={1} className={classNames.appList}>
                  {calculatedApps.base.items.map((item, index) => (
                    <LinkListItem
                      key={index}
                      href={item.url}
                      target={item.target}
                      className={classNames.link}
                    >
                      {item.label}
                    </LinkListItem>
                  ))}
                </Cluster>
              </Stack>
            )}
            <Cluster gap={1.5}>
              {calculatedApps.others.map(({ heading, items }, i) => (
                <Stack key={i} gap={0.5} className={classNames.category} as="section">
                  <Heading type="subSubBlockTitle">{heading}</Heading>
                  <Stack gap={0.5} as="ul" className={classNames.appList}>
                    {items.map((item, index) => (
                      <LinkListItem
                        key={index}
                        href={item.url}
                        target={item.target}
                        className={classNames.link}
                      >
                        {item.label}
                      </LinkListItem>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Cluster>
          </Stack>
          <TextLinkToShowAll href={urlToShowAll} className={classNames.footer} />
        </Stack>
      </DropdownContent>
    </Dropdown>
  )
}

const MemoizedDropdownTrigger = memo<
  Pick<Props, 'enableNew' | 'decorators'> & { className: string }
>(({ enableNew, className, decorators }) => {
  const triggerLabel = useMemo(
    () => decorators?.triggerLabel?.(TRIGGER_LABEL) || TRIGGER_LABEL,
    [decorators],
  )

  return (
    <DropdownTrigger>
      <Button
        prefix={enableNew ?? <FaToolboxIcon />}
        suffix={enableNew ? <FaCaretDownIcon /> : undefined}
        className={className}
      >
        {triggerLabel}
      </Button>
    </DropdownTrigger>
  )
})

const TextLinkToShowAll = memo<{ href: Props['urlToShowAll']; className: string }>(
  ({ href, className }) =>
    href && (
      <div className={className}>
        <TextLink href={href} style={{ width: 'fit-content' }}>
          すべて見る
        </TextLink>
      </div>
    ),
)

const LinkListItem = memo<{
  href: AppItem['url']
  target: AppItem['target']
  children: AppItem['label']
  className: string
}>(({ href, target, children, className }) => (
  <li>
    <TextLink href={href} target={target} className={className}>
      {children}
    </TextLink>
  </li>
))
