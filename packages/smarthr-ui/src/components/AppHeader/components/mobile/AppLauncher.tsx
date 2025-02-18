import React, { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../../../Button'
import { FaCircleXmarkIcon } from '../../../Icon'
import { SearchInput } from '../../../Input'
import { Cluster } from '../../../Layout'
import { Text } from '../../../Text'
import { TextLink } from '../../../TextLink'
import { useAppLauncher } from '../../hooks/useAppLauncher'
import { useTranslate } from '../../hooks/useTranslate'
import { Launcher } from '../../types'
import { AppLauncherFeatures } from '../common/AppLauncherFeatures'
import { AppLauncherSortDropdown } from '../common/AppLauncherSortDropdown'
import { Translate } from '../common/Translate'

import { AppLauncherFilterDropdown } from './AppLauncherFilterDropdown'

type Props = {
  features: Array<Launcher['feature']>
}

const appLauncher = tv({
  slots: {
    wrapper: ['smarthr-ui-AppLauncher', 'shr-flex shr-flex-col shr-h-full'],
    searchArea: [
      'smarthr-ui-AppLauncher-searchArea',
      'shr-py-0.75 shr-px-1 shr-border-b-shorthand',
      '[&_.smarthr-ui-Input]:shr-h-[42px]',
    ],
    headArea: 'shr-py-0.75 shr-px-1',
    scrollArea: 'shr-overflow-y-scroll shr-flex-1 shr-basis-0',
    bottomArea: 'shr-py-0.75 shr-px-1 shr-border-t-shorthand',
  },
})

export const AppLauncher: FC<Props> = ({ features: baseFeatures }) => {
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

  const classNames = useMemo(() => {
    const { wrapper, searchArea, headArea, scrollArea, bottomArea } = appLauncher()

    return {
      wrapper: wrapper(),
      searchArea: searchArea(),
      headArea: headArea(),
      scrollArea: scrollArea(),
      bottomArea: bottomArea(),
    }
  }, [])

  const translate = useTranslate()

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.searchArea}>
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

      <Cluster className={classNames.headArea} justify="space-between" align="center">
        {mode === 'search' ? (
          <Text size="S" weight="bold">
            <Translate>{translate('Launcher/searchResultText')}</Translate>
          </Text>
        ) : (
          <AppLauncherFilterDropdown page={page} onSelectPage={(p) => changePage(p)} />
        )}

        {(mode === 'search' || page === 'all') && (
          <AppLauncherSortDropdown
            sortType={sortType}
            onSelectSortType={(value) => setSortType(value)}
          />
        )}
      </Cluster>

      <div className={classNames.scrollArea}>
        <AppLauncherFeatures features={features} page={page} />
      </div>

      <div className={classNames.bottomArea}>
        <Text size="XS">
          <TextLink
            href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
            target="_blank"
          >
            <Translate>{translate('Launcher/helpText')}</Translate>
          </TextLink>
        </Text>
      </div>
    </div>
  )
}
