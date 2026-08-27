import { type FC, type PropsWithChildren, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../../../intl'
import { AnchorButton } from '../../../Button'
import { FaArrowRightIcon, FaStarIcon } from '../../../Icon'
import { Center } from '../../../Layout'
import { LineClamp } from '../../../LineClamp'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { mediaQuery, useMediaQuery } from '../../hooks/useMediaQuery'

import { Translate } from './Translate'

import type { Launcher } from '../../types'

const classNameGenerator = tv({
  slots: {
    empty: ['shr-p-1 shr-text-center'],
    loadError: ['shr-whitespace-pre-wrap shr-p-1 shr-text-center'],
    loading: ['shr-py-3'],
    list: ['shr-list-none', '[&>li]:shr-px-0.5 [&>li]:shr-py-0.25'],
    listItem: [
      'smarthr-ui-AppLauncher-listItem',
      'shr-grid shr-min-h-[2.5rem] shr-grid-cols-[1rem_1fr_1rem] shr-gap-0.75 shr-whitespace-normal shr-px-1 shr-py-0 shr-text-left shr-leading-tight',
      'data-[favorite="false"]:shr-grid-cols-[1fr_1rem]',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { empty, loadError, loading, list, listItem } = classNameGenerator()

  return {
    empty: empty(),
    loadError: loadError(),
    loading: loading(),
    list: list(),
    listItem: listItem(),
  }
})()

type Props = {
  features: Array<Launcher['feature']>
  page: Launcher['page']
  loading?: boolean
  error?: boolean
}

export const AppLauncherFeatures: FC<Props> = ({ features, page, loading, error }) => {
  if (loading) {
    return <LoadingList />
  }

  if (error) {
    return <LoadErrorText />
  }

  return features.length === 0 ? <EmptyList /> : <FeatureList features={features} page={page} />
}

const LoadingList = memo(() => (
  <Center className={CLASS_NAMES.loading}>
    <Loader />
  </Center>
))

const LoadErrorText = memo(() => (
  <div className={CLASS_NAMES.loadError}>
    <Text size="S">
      <Translate>
        <Localizer
          id="smarthr-ui/AppHeader/Launcher/loadError"
          defaultText={`アプリ一覧の読み込みに失敗しました。
時間をおいて、やり直してください。`}
        />
      </Translate>
    </Text>
  </div>
))

const EmptyList = memo(() => (
  <div className={CLASS_NAMES.empty}>
    <Text size="S">
      <Translate>
        <Localizer
          id="smarthr-ui/AppHeader/Launcher/emptyText"
          defaultText="該当するアプリが見つかりませんでした。"
        />
      </Translate>
    </Text>
  </div>
))

const FeatureList: FC<Props> = ({ features, page }) => {
  const isFavorite = page === 'favorite'

  return (
    <ul className={CLASS_NAMES.list}>
      {features.map((feature) => (
        <FeatureListItem
          key={feature.id}
          href={feature.url}
          isFavorite={isFavorite}
          className={CLASS_NAMES.listItem}
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
      prefix={isFavorite && <FaStarIcon />}
      suffix={<FaArrowRightIcon />}
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
