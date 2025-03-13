import React, { type FC } from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton } from '../../../Button'
import { FaArrowRightIcon, FaStarIcon } from '../../../Icon'
import { LineClamp } from '../../../LineClamp'
import { Text } from '../../../Text'
import { mediaQuery, useMediaQuery } from '../../hooks/useMediaQuery'
import { useTranslate } from '../../hooks/useTranslate'

import { Translate } from './Translate'

import type { Launcher } from '../../types'

const appLauncherFeatures = tv({
  slots: {
    empty: ['shr-p-1 shr-text-center'],
    list: ['shr-list-none', '[&>li]:shr-px-0.5 [&>li]:shr-py-0.25'],
    listItem: [
      'smarthr-ui-AppLauncher-listItem',
      'shr-grid shr-grid-cols-[1rem_1fr_1rem] shr-gap-0.75 shr-min-h-[2.5rem] shr-px-1 shr-py-0 shr-leading-tight shr-text-left shr-whitespace-normal',
    ],
  },
  variants: {
    favorite: {
      false: {
        listItem: ['shr-grid-cols-[1fr_1rem]'],
      },
    },
  },
})

type Props = {
  features: Array<Launcher['feature']>
  page: Launcher['page']
}

export const AppLauncherFeatures: FC<Props> = ({ features, page }) => {
  const isDesktop = useMediaQuery(mediaQuery.desktop)
  const translate = useTranslate()
  const { empty, list, listItem } = appLauncherFeatures()

  if (features.length === 0) {
    return (
      <div className={empty()}>
        <Text size="S">
          <Translate>{translate('Launcher/emptyText')}</Translate>
        </Text>
      </div>
    )
  }

  return (
    <ul className={list()}>
      {features.map((feature) => (
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
            {isDesktop ? <LineClamp maxLines={2}>{feature.name}</LineClamp> : feature.name}
          </AnchorButton>
        </li>
      ))}
    </ul>
  )
}
