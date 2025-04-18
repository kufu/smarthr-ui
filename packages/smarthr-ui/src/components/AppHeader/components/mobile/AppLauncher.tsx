import { type FC, type PropsWithChildren, memo, useMemo } from 'react'
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

type Props = {
  features: Array<Launcher['feature']>
}

const classNameGenerator = tv({
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

  const translate = useTranslate()
  const translated = useMemo(
    () => ({
      searchInputTitle: translate('Launcher/searchInputTitle'),
      searchResultText: translate('Launcher/searchResultText'),
      helpText: translate('Launcher/helpText'),
    }),
    [translate],
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
      <TextLink
        href="https://support.smarthr.jp/ja/help/articles/2bfd350d-8e8b-4bbd-a209-426d2eb302cc/"
        target="_blank"
      >
        <Translate>{children}</Translate>
      </TextLink>
    </Text>
  </div>
))
