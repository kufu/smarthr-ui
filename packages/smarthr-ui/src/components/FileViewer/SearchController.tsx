'use client'

import { type FC, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../hooks/useEnvironment'
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
      },
    },
  },
})

export const SearchController: FC<Props> = memo(({ search }) => {
  const {
    query,
    handleChangeQuery,
    handleKeyDownQuery,
    matchCount,
    currentMatchIndex,
    goNext,
    goPrev,
  } = search
  const { mobile } = useEnvironment()
  const classNames = useMemo(() => {
    const { wrapper, inputArea } = classNameGenerator({ mobile })
    return { wrapper: wrapper(), inputArea: inputArea() }
  }, [mobile])

  const noMatches = matchCount === 0

  return (
    <div className={classNames.wrapper}>
      <div className={classNames.inputArea}>
        <SearchInput
          name="file_viewer_search"
          value={query}
          width="100%"
          className="[&_.smarthr-ui-Input]:shr-rounded-e-none"
          onChange={handleChangeQuery}
          onKeyDown={handleKeyDownQuery}
          tooltipMessage={
            <Localizer
              id="smarthr-ui/FileViewer/searchInputTooltipMessage"
              defaultText="PDF内のテキストを検索"
            />
          }
          suffix={
            query !== '' ? (
              <Text size="S" className="shr-tabular-nums" aria-live="polite">
                {`${noMatches ? 0 : currentMatchIndex + 1}/${matchCount}`}
              </Text>
            ) : undefined
          }
        />
      </div>
      <Button
        disabled={noMatches}
        className="shr-rounded-none shr-border-s-0 shr-p-0.75 aria-disabled:!shr-border-default"
        onClick={goPrev}
      >
        <FaAngleUpIcon
          alt={
            <Localizer id="smarthr-ui/FileViewer/previousMatchAlt" defaultText="前の検索結果へ" />
          }
        />
      </Button>
      <Button
        disabled={noMatches}
        className="shr-rounded-s-none shr-border-s-0 shr-p-0.75 aria-disabled:!shr-border-default"
        onClick={goNext}
      >
        <FaAngleDownIcon
          alt={<Localizer id="smarthr-ui/FileViewer/nextMatchAlt" defaultText="次の検索結果へ" />}
        />
      </Button>
    </div>
  )
})
