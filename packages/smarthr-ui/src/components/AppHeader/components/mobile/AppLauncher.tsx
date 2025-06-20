import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { UnstyledButton } from '../../../Button'
import { FaCircleXmarkIcon } from '../../../Icon'
import { SearchInput } from '../../../Input'
import { Cluster } from '../../../Layout'
import { Text } from '../../../Text'
import { HelpLink } from '../../../TextLink'
import { useAppLauncher } from '../../hooks/useAppLauncher'
import { AppLauncherFeatures } from '../common/AppLauncherFeatures'
import { AppLauncherSortDropdown } from '../common/AppLauncherSortDropdown'
import { Translate } from '../common/Translate'

import { AppLauncherFilterDropdown } from './AppLauncherFilterDropdown'

import type { Launcher } from '../../types'

type Props = {
  features: Array<Launcher['feature']>
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
    scrollArea: 'shr-flex-1 shr-basis-0 shr-overflow-y-scroll',
    bottomArea: 'shr-border-t-shorthand shr-px-1 shr-py-0.75',
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
    onChangeSearchQuery,
    onClickClearSearchQuery,
  } = useAppLauncher(baseFeatures)

  const classNames = useMemo(() => {
    const { wrapper, searchArea, headArea, scrollArea, bottomArea } = classNameGenerator()

    return {
      wrapper: wrapper(),
      searchArea: searchArea(),
      headArea: headArea(),
      scrollArea: scrollArea(),
      bottomArea: bottomArea(),
    }
  }, [])

  const { localize } = useIntl()
  const translated = useMemo(
    () => ({
      searchInputTitle: localize({
        id: 'smarthr-ui/AppHeader/Launcher/searchInputTitle',
        defaultText: 'アプリ名を入力してください。',
      }),
      searchResultText: localize({
        id: 'smarthr-ui/AppHeader/Launcher/searchResultText',
        defaultText: '検索結果',
      }),
      helpText: localize({
        id: 'smarthr-ui/AppHeader/Launcher/helpText',
        defaultText: 'よく使うアプリとは',
      }),
    }),
    [localize],
  )

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.searchArea}>
        <SearchInput
          name="search"
          title={translated.searchInputTitle}
          tooltipMessage={<Translate>{translated.searchInputTitle}</Translate>}
          width="100%"
          value={searchQuery}
          suffix={mode === 'search' && <ClearSearchButton onClick={onClickClearSearchQuery} />}
          onChange={onChangeSearchQuery}
        />
      </div>

      <Cluster className={classNames.headArea} justify="space-between" align="center">
        {mode === 'search' ? (
          <SearchResultText>{translated.searchResultText}</SearchResultText>
        ) : (
          <AppLauncherFilterDropdown page={page} onSelectPage={changePage} />
        )}

        {(mode === 'search' || page === 'all') && (
          <AppLauncherSortDropdown sortType={sortType} onSelectSortType={setSortType} />
        )}
      </Cluster>

      <div className={classNames.scrollArea}>
        <AppLauncherFeatures features={features} page={page} />
      </div>

      <BottomArea className={classNames.bottomArea}>{translated.helpText}</BottomArea>
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
    <Translate>{children}</Translate>
  </Text>
))

const BottomArea = memo<PropsWithChildren<{ className: string }>>(({ children, className }) => (
  <div className={className}>
    <Text size="XS">
      <HelpLink
        href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
        target="_blank"
      >
        <Translate>{children}</Translate>
      </HelpLink>
    </Text>
  </div>
))
