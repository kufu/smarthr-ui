import { type FC, type PropsWithChildren, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer, useLocalize } from '../../../../intl'
import { UnstyledButton } from '../../../Button'
import { FaCircleXmarkIcon } from '../../../Icon'
import { SearchInput } from '../../../Input'
import { Cluster } from '../../../Layout'
import { Scroller } from '../../../Scroller'
import { Text } from '../../../Text'
import { HelpLink } from '../../../TextLink'

import { FeatureList } from './FeatureList'
import { LauncherFilterDropdown } from './LauncherFilterDropdown'
import { LauncherSortDropdown } from './LauncherSortDropdown'
import { useLauncher } from './useLauncher'

import type { Launcher } from '../../types'

type Props = {
  features: Array<Launcher['feature']>
  loading?: boolean
  error?: boolean
}

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-AppLauncher', 'shr-flex shr-h-full shr-flex-col'],
    searchArea: [
      'smarthr-ui-AppLauncher-searchArea',
      'shr-border-b-shorthand shr-px-1 shr-py-0.75',
      '[&_.smarthr-ui-Input]:shr-h-[42px]',
    ],
    headArea: 'shr-px-1 shr-py-0.75',
    scrollArea: 'shr-flex-1 shr-basis-0',
    bottomArea: 'shr-border-t-shorthand shr-px-1 shr-py-0.75',
  },
})

const CLASS_NAMES = (() => {
  // eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
  const { wrapper, searchArea, headArea, scrollArea, bottomArea } = classNameGenerator()

  return {
    wrapper: wrapper(),
    searchArea: searchArea(),
    headArea: headArea(),
    scrollArea: scrollArea(),
    bottomArea: bottomArea(),
  }
})()

export const MobileLauncher: FC<Props> = ({ features: baseFeatures, loading, error }) => {
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
    callbackRef,
  } = useLauncher(baseFeatures)

  const { searchInputTitle } = useLocalize({
    searchInputTitle: {
      id: 'smarthr-ui/AppHeader/Launcher/searchInputTitle',
      defaultText: 'アプリ名を入力してください。',
    },
  })

  return (
    <div ref={callbackRef} className={CLASS_NAMES.wrapper}>
      <div className={CLASS_NAMES.searchArea}>
        <SearchInput
          name="search"
          value={searchQuery}
          title={searchInputTitle}
          width="100%"
          onChange={onChangeSearchQuery}
          tooltipMessage={searchInputTitle}
          suffix={mode === 'search' && <ClearSearchButton onClick={onClickClearSearchQuery} />}
        />
      </div>

      <Cluster justify="space-between" align="center" className={CLASS_NAMES.headArea}>
        {mode === 'search' ? (
          <SearchResultText>
            <Localizer id="smarthr-ui/AppHeader/Launcher/searchResultText" defaultText="検索結果" />
          </SearchResultText>
        ) : (
          <LauncherFilterDropdown page={page} handleSelectPage={changePage} />
        )}

        {(mode === 'search' || page === 'all') && (
          <LauncherSortDropdown sortType={sortType} handleSelectSortType={setSortType} />
        )}
      </Cluster>

      <Scroller styleType="scroll" className={CLASS_NAMES.scrollArea}>
        <FeatureList features={features} page={page} loading={loading} error={error} />
      </Scroller>

      <BottomArea className={CLASS_NAMES.bottomArea}>
        <Localizer id="smarthr-ui/AppHeader/Launcher/helpText" defaultText="よく使うアプリとは" />
      </BottomArea>
    </div>
  )
}

const ClearSearchButton = memo<{ onClick: () => void }>(({ onClick }) => (
  <UnstyledButton onClick={onClick}>
    <FaCircleXmarkIcon />
  </UnstyledButton>
))

const SearchResultText = memo<PropsWithChildren>(({ children }) => (
  <Text size="S" weight="bold">
    {children}
  </Text>
))

const BottomArea = memo<PropsWithChildren<{ className: string }>>(({ children, className }) => (
  <div className={className}>
    <HelpLink
      href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
      target="_blank"
      size="XS"
    >
      {children}
    </HelpLink>
  </div>
))
