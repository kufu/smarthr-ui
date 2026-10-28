import { type ComponentPropsWithRef, type FC, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../../../intl'
import { AnchorButton } from '../../../Button'
import { FaArrowRightIcon, FaStarIcon } from '../../../Icon'
import { Center } from '../../../Layout'
import { Loader } from '../../../Loader'
import { Text } from '../../../Text'
import { mediaQuery, useMediaQuery } from '../../hooks/useMediaQuery'

import type { Launcher } from '../../types'

const classNameGenerator = tv({
  slots: {
    message: ['shr-p-1 shr-text-center'],
    list: ['shr-list-none', '[&>li]:shr-px-0.5 [&>li]:shr-py-0.25'],
    listItem: [
      'smarthr-ui-AppLauncher-listItem',
      'shr-grid shr-min-h-[2.5rem] shr-grid-cols-[1rem_1fr_1rem] shr-gap-0.75 shr-whitespace-normal shr-px-1 shr-py-0 shr-text-left shr-leading-tight',
      'data-[favorite="false"]:shr-grid-cols-[1fr_1rem]',
    ],
  },
})

const CLASS_NAMES = (() => {
  // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
  const { message, list, listItem } = classNameGenerator()

  return {
    message: message(),
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

export const FeatureList: FC<Props> = ({ features, page, loading, error }) => {
  if (loading) {
    return <LoadingList />
  }

  if (error) {
    return <LoadErrorText />
  }

  return features.length === 0 ? <EmptyList /> : <FeatureItems features={features} page={page} />
}

const LoadingList = memo(() => (
  <Center padding={3}>
    <Loader />
  </Center>
))

const LoadErrorText = memo(() => (
  <div className={CLASS_NAMES.message}>
    <Text whiteSpace="pre-wrap" size="S">
      <Localizer
        id="smarthr-ui/AppHeader/Launcher/loadError"
        defaultText={`アプリ一覧の読み込みに失敗しました。
時間をおいて、やり直してください。`}
      />
    </Text>
  </div>
))

const EmptyList = memo(() => (
  <div className={CLASS_NAMES.message}>
    <Text size="S">
      <Localizer
        id="smarthr-ui/AppHeader/Launcher/emptyText"
        defaultText="該当するアプリが見つかりませんでした。"
      />
    </Text>
  </div>
))

const FeatureItems: FC<Props> = ({ features, page }) => {
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
      variant="text"
      wide
      className={className}
      data-favorite={isFavorite}
      prefix={isFavorite && <FaStarIcon />}
      suffix={<FaArrowRightIcon />}
    >
      <FeatureName>{children}</FeatureName>
    </AnchorButton>
  </li>
))

const FeatureName: FC<Pick<ComponentPropsWithRef<typeof FeatureListItem>, 'children'>> = ({
  children,
}) => {
  const isDesktop = useMediaQuery(mediaQuery.desktop)

  return isDesktop ? (
    <Text as="span" maxLines={{ max: 2, tooltip: true }}>
      {children}
    </Text>
  ) : (
    children
  )
}
