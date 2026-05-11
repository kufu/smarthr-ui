'use client'

import { type ChangeEvent, type FC, type KeyboardEvent, memo, useCallback, useMemo } from 'react'

import {
  Button,
  Cluster,
  FaAngleDownIcon,
  FaAngleUpIcon,
  FaXmarkIcon,
  SearchInput,
  Text,
} from '../..'
import { useIntl } from '../../intl'

type Props = {
  query: string
  setQuery: (query: string) => void
  matchCount: number
  currentMatchIndex: number
  onClickNext: () => void
  onClickPrev: () => void
  onClickClear: () => void
}

export const SearchController: FC<Props> = memo(
  ({ query, setQuery, matchCount, currentMatchIndex, onClickNext, onClickPrev, onClickClear }) => {
    const { localize } = useIntl()
    const translated = useMemo(
      () => ({
        searchInputPlaceholder: localize({
          id: 'smarthr-ui/FileViewer/searchInputPlaceholder',
          defaultText: '検索',
        }),
        searchInputTooltipMessage: localize({
          id: 'smarthr-ui/FileViewer/searchInputTooltipMessage',
          defaultText: 'PDF内のテキストを検索',
        }),
        previousMatchAlt: localize({
          id: 'smarthr-ui/FileViewer/previousMatchAlt',
          defaultText: '前の検索結果へ',
        }),
        nextMatchAlt: localize({
          id: 'smarthr-ui/FileViewer/nextMatchAlt',
          defaultText: '次の検索結果へ',
        }),
        clearSearchAlt: localize({
          id: 'smarthr-ui/FileViewer/clearSearchAlt',
          defaultText: '検索をクリア',
        }),
      }),
      [localize],
    )

    const hasMatches = matchCount > 0
    const displayedCurrent = hasMatches ? currentMatchIndex + 1 : 0

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
      },
      [setQuery],
    )

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          if (e.shiftKey) {
            onClickPrev()
          } else {
            onClickNext()
          }
        } else if (e.key === 'Escape' && query !== '') {
          e.preventDefault()
          onClickClear()
        }
      },
      [onClickNext, onClickPrev, onClickClear, query],
    )

    return (
      <Cluster gap={0.5} align="center">
        <SearchInput
          name="file_viewer_search"
          tooltipMessage={translated.searchInputTooltipMessage}
          placeholder={translated.searchInputPlaceholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          width={200}
        />
        <Text size="S" aria-live="polite" className="shr-tabular-nums">
          {`${displayedCurrent} / ${matchCount}`}
        </Text>
        <Button onClick={onClickPrev} disabled={!hasMatches} className="shr-p-0.75">
          <FaAngleUpIcon alt={translated.previousMatchAlt} />
        </Button>
        <Button onClick={onClickNext} disabled={!hasMatches} className="shr-p-0.75">
          <FaAngleDownIcon alt={translated.nextMatchAlt} />
        </Button>
        {query !== '' && (
          <Button onClick={onClickClear} className="shr-p-0.75">
            <FaXmarkIcon alt={translated.clearSearchAlt} />
          </Button>
        )}
      </Cluster>
    )
  },
)
