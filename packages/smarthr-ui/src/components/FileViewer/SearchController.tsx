'use client'

import { type FC, type KeyboardEvent, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../hooks/useEnvironment'
import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
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
  const { query, handleChangeQuery, matchCount, currentMatchIndex, goNext, goPrev, clear } = search
  const { mobile } = useEnvironment()
  const classNames = useMemo(() => {
    const { wrapper, inputArea } = classNameGenerator({ mobile })
    return { wrapper: wrapper(), inputArea: inputArea() }
  }, [mobile])

  const noMatches = matchCount === 0

  const latest = useLatest({
    goNext,
    goPrev,
    clear,
    query,
  })

  const functions = useMemo(
    () => ({
      handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) {
          return
        }
        switch (e.key) {
          case 'Enter': {
            e.preventDefault()
            if (e.shiftKey) {
              latest.goPrev()
            } else {
              latest.goNext()
            }
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
          tooltipMessage={
            <Localizer
              id="smarthr-ui/FileViewer/searchInputTooltipMessage"
              defaultText="PDF内のテキストを検索"
            />
          }
          value={query}
          onChange={handleChangeQuery}
          onKeyDown={functions.handleKeyDown}
          width="100%"
          suffix={
            query !== '' ? (
              <Text size="S" aria-live="polite" className="shr-tabular-nums">
                {`${noMatches ? 0 : currentMatchIndex + 1}/${matchCount}`}
              </Text>
            ) : undefined
          }
          className="[&_.smarthr-ui-Input]:shr-rounded-e-none"
        />
      </div>
      <Button
        onClick={goPrev}
        disabled={noMatches}
        className="shr-rounded-none shr-border-s-0 shr-p-0.75 aria-disabled:!shr-border-default"
      >
        <FaAngleUpIcon
          alt={
            <Localizer id="smarthr-ui/FileViewer/previousMatchAlt" defaultText="前の検索結果へ" />
          }
        />
      </Button>
      <Button
        onClick={goNext}
        disabled={noMatches}
        className="shr-rounded-s-none shr-border-s-0 shr-p-0.75 aria-disabled:!shr-border-default"
      >
        <FaAngleDownIcon
          alt={<Localizer id="smarthr-ui/FileViewer/nextMatchAlt" defaultText="次の検索結果へ" />}
        />
      </Button>
    </div>
  )
})
