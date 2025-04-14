import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../../../Button'
import { FaCircleXmarkIcon } from '../../../Icon'
import { SearchInput } from '../../../Input'
import { Cluster } from '../../../Layout'
import { Text } from '../../../Text'
import { TextLink } from '../../../TextLink'
import { useAppLauncher } from '../../hooks/useAppLauncher'
import { useTranslate } from '../../hooks/useTranslate'
import { AppLauncherFeatures } from '../common/AppLauncherFeatures'
import { AppLauncherSortDropdown } from '../common/AppLauncherSortDropdown'
import { Translate } from '../common/Translate'

import { AppLauncherFilterDropdown } from './AppLauncherFilterDropdown'

import type { Launcher } from '../../types'
import type { FC } from 'react'

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
  const translate = useTranslate()
  const {
    features,
    page,
    mode,
    sortType,
    searchQuery,
    changePage,
    setSortType,
    onChangeSearchQuery,
    onClickClearSearchQuery,
  } = useAppLauncher(baseFeatures)

  const { wrapper, searchArea, headArea, scrollArea, bottomArea } = appLauncher()

  return (
    <div className={wrapper()}>
      <div className={searchArea()}>
        <SearchInput
          name="search"
          title={translate('Launcher/searchInputTitle')}
          tooltipMessage={<Translate>{translate('Launcher/searchInputTitle')}</Translate>}
          width="100%"
          value={searchQuery}
          suffix={
            mode === 'search' && (
              <UnstyledButton onClick={onClickClearSearchQuery}>
                <FaCircleXmarkIcon />
              </UnstyledButton>
            )
          }
          onChange={onChangeSearchQuery}
        />
      </div>

      <Cluster className={headArea()} justify="space-between" align="center">
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

      <div className={scrollArea()}>
        <AppLauncherFeatures features={features} page={page} />
      </div>

      <div className={bottomArea()}>
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
