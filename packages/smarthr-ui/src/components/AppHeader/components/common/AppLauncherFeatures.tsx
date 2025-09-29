import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { AnchorButton } from '../../../Button'
import { FaArrowRightIcon, FaStarIcon } from '../../../Icon'
import { LineClamp } from '../../../LineClamp'
import { Text } from '../../../Text'
import { mediaQuery, useMediaQuery } from '../../hooks/useMediaQuery'

import { Translate } from './Translate'

import type { Launcher } from '../../types'

const classNameGenerator = tv({
  slots: {
    empty: ['shr-p-1 shr-text-center'],
    list: ['shr-list-none', '[&>li]:shr-px-0.5 [&>li]:shr-py-0.25'],
    listItem: [
      'smarthr-ui-AppLauncher-listItem',
      'shr-grid shr-min-h-[2.5rem] shr-grid-cols-[1rem_1fr_1rem] shr-gap-0.75 shr-whitespace-normal shr-px-1 shr-py-0 shr-text-left shr-leading-tight',
      'data-[favorite="false"]:shr-grid-cols-[1fr_1rem]',
    ],
  },
})

type Props = {
  features: Array<Launcher['feature']>
  page: Launcher['page']
}

export const AppLauncherFeatures: FC<Props> = ({ features, page }) =>
  features.length === 0 ? <EmptyList /> : <FeatureList features={features} page={page} />

const EmptyList = memo(() => {
  const className = useMemo(() => {
    const { empty } = classNameGenerator()

    return empty()
  }, [])
  const { localize } = useIntl()
  const translated = useMemo(
    () =>
      localize({
        id: 'smarthr-ui/AppHeader/Launcher/emptyText',
        defaultText: '該当するアプリが見つかりませんでした。',
      }),
    [localize],
  )

  return (
    <div className={className}>
      <Text size="S">
        <Translate>{translated}</Translate>
      </Text>
    </div>
  )
})

const FeatureList: FC<Props> = ({ features, page }) => {
  const classNames = useMemo(() => {
    const { list, listItem } = classNameGenerator()

    return {
      list: list(),
      listItem: listItem(),
    }
  }, [])

  const isFavorite = page === 'favorite'

  return (
    <ul className={classNames.list}>
      {features.map((feature) => (
        <FeatureListItem
          key={feature.id}
          href={feature.url}
          isFavorite={isFavorite}
          className={classNames.listItem}
        >
          {feature.name}
        </FeatureListItem>
      ))}
    </ul>
  )
}

const FeatureListItem = memo<{
  href: Props['features'][number]['url']
  children: Props['features'][number]['name']
  className: string
  isFavorite: boolean
}>(({ href, children, isFavorite, className }) => (
  <li>
    <AnchorButton
      href={href}
      target="_blank"
      prefix={isFavorite && <FaStarIcon aria-hidden={true} />}
      suffix={<FaArrowRightIcon aria-hidden={true} />}
      variant="text"
      wide
      data-favorite={isFavorite}
      className={className}
    >
      <FeatureName>{children}</FeatureName>
    </AnchorButton>
  </li>
))

const FeatureName: FC<PropsWithChildren> = ({ children }) => {
  const isDesktop = useMediaQuery(mediaQuery.desktop)

  return isDesktop ? <LineClamp maxLines={2}>{children}</LineClamp> : children
}
