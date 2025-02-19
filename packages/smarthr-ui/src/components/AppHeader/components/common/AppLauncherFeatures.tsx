import React, { type FC, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton } from '../../../Button'
import { FaArrowRightIcon, FaStarIcon } from '../../../Icon'
import { LineClamp } from '../../../LineClamp'
import { Text } from '../../../Text'
import { mediaQuery, useMediaQuery } from '../../hooks/useMediaQuery'
import { useTranslate } from '../../hooks/useTranslate'
import { Launcher } from '../../types'

import { Translate } from './Translate'

const classNameGenerator = tv({
  slots: {
    empty: ['shr-p-1 shr-text-center'],
    list: ['shr-list-none', '[&>li]:shr-px-0.5 [&>li]:shr-py-0.25'],
    listItem: [
      'smarthr-ui-AppLauncher-listItem',
      'shr-grid shr-grid-cols-[1rem_1fr_1rem] shr-gap-0.75 shr-min-h-[2.5rem] shr-px-1 shr-py-0 shr-leading-tight shr-text-left shr-whitespace-normal',
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
  const translate = useTranslate()
  const translated = useMemo(() => translate('Launcher/emptyText'), [translate])

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
        <li key={feature.id}>
          <AnchorButton
            href={feature.url}
            target="_blank"
            prefix={isFavorite && <FaStarIcon />}
            suffix={<FaArrowRightIcon />}
            variant="text"
            wide
            data-favorite={isFavorite}
            className={classNames.listItem}
          >
            <FeatureName>{feature.name}</FeatureName>
          </AnchorButton>
        </li>
      ))}
    </ul>
  )
}

const FeatureName = memo<PropsWithChildren>(({ children }) => {
  const isDesktop = useMediaQuery(mediaQuery.desktop)

  return isDesktop ? <LineClamp maxLines={2}>{children}</LineClamp> : children
})
