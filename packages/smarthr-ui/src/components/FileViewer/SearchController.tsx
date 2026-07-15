'use client'

import { type ChangeEvent, type FC, type KeyboardEvent, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../hooks/useEnvironment'
import { useLatest } from '../../hooks/useLatest'
import { useIntl } from '../../intl'
import { Button } from '../Button'
import { FaAngleDownIcon, FaAngleUpIcon } from '../Icon'
import { SearchInput } from '../Input'
import { Text } from '../Text'

import type { UsePDFSearch } from './usePDFSearch'

type Props = {
  search: UsePDFSearch
}

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-flex shr-w-full',
    inputArea: 'shr-min-w-0 shr-grow',
  },
  variants: {
    mobile: {
      true: {},
      false: {
        wrapper: 'shr-justify-end',
        inputArea: 'shr-max-w-[15em]',
      },
    },
  },
})

export const SearchController: FC<Props> = memo(({ search }) => {
  const { query, setQuery, matchCount, currentMatchIndex, goNext, goPrev, clear } = search
  const { localize } = useIntl()
  const { mobile } = useEnvironment()
  const classNames = useMemo(() => {
    const { wrapper, inputArea } = classNameGenerator({ mobile })
    return { wrapper: wrapper(), inputArea: inputArea() }
  }, [mobile])
  const translated = useMemo(
    () => ({
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
    }),
    [localize],
  )

  const notMatches = matchCount === 0

  const latest = useLatest({ setQuery, goNext, goPrev, clear, query })

  const functions = useMemo(
    () => ({
      handleChange: (e: ChangeEvent<HTMLInputElement>) => {
        latest.setQuery(e.target.value)
      },
      handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) {
          return
        }

        switch (e.key) {
          case 'Enter': {
            e.preventDefault()
            latest[e.shiftKey ? 'goPrev' : 'goNext']()
            break
          }
          case 'Escape': {
            if (latest.query !== '') {
              e.preventDefault()
              latest.clear()
            }
            break
          }
        }
      },
    }),
    [latest],
  )

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.inputArea}>
        <SearchInput
          name="file_viewer_search"
          tooltipMessage={translated.searchInputTooltipMessage}
          value={query}
          onChange={functions.handleChange}
          onKeyDown={functions.handleKeyDown}
          width="100%"
          suffix={
            query !== '' ? (
              <Text size="S" aria-live="polite" className="shr-tabular-nums">
                {`${notMatches ? 0 : currentMatchIndex + 1}/${matchCount}`}
              </Text>
            ) : undefined
          }
          className="[&_.smarthr-ui-Input]:shr-rounded-e-none"
        />
      </div>
      <Button
        onClick={goPrev}
        disabled={notMatches}
        className="shr-rounded-none shr-border-s-0 shr-p-0.75 aria-disabled:!shr-border-default"
      >
        <FaAngleUpIcon alt={translated.previousMatchAlt} />
      </Button>
      <Button
        onClick={goNext}
        disabled={notMatches}
        className="shr-rounded-s-none shr-border-s-0 shr-p-0.75 aria-disabled:!shr-border-default"
      >
        <FaAngleDownIcon alt={translated.nextMatchAlt} />
      </Button>
    </div>
  )
})
