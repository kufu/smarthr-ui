import { Fragment, type ReactNode, useId, useMemo, useState } from 'react'
import { Cluster, FaCaretRightIcon, Table, Td, Text, Th } from 'smarthr-ui'
import { tv } from 'tailwind-variants'

import type { ChartData, ChartOptions, ChartType } from 'chart.js'

type ChartName = Exclude<ChartType, 'bubble' | 'scatter' | 'polarArea'>

type Props<T extends ChartName> = {
  data: ChartData<T>
  options?: ChartOptions<T>
}

type TableRow = {
  label: ReactNode
  values: Array<number | null>
}

type DefaultTableProps = {
  data: {
    headers: ReactNode[]
    rows: TableRow[]
  }
  classNames: TableClassNames
}

type GroupedTableProps = {
  data: {
    headers: ReactNode[]
    groups: Array<{ label: ReactNode; rows: TableRow[] }>
  }
  // TODO: smarthr-ui-charts自信が翻訳プロバイダーを持つ時入れます
  // localize: ReturnType<typeof useIntl>['localize']
  classNames: TableClassNames
}

type TableClassNames = ReturnType<typeof buildClassNames>

const classNameGenerator = tv({
  slots: {
    verticalHeader: [
      '[&>tbody>tr>th:first-child]:shr-w-[1%] [&>tbody>tr>th:first-child]:shr-min-w-[10rem] [&>tbody>tr>th:first-child]:shr-max-w-[24rem] [&>tbody>tr>th:first-child]:shr-whitespace-normal',
      '[&>tbody>tr>td:first-child]:shr-w-[1%] [&>tbody>tr>td:first-child]:shr-min-w-[10rem] [&>tbody>tr>td:first-child]:shr-max-w-[24rem]',
    ],
    leftIcon: 'shr-transition-transform shr-duration-100 group-aria-expanded:shr-rotate-90',
    title: 'shr-grow',
    titleWrapper: 'shr-flex-nowrap',
    rowTh: '!shr-bg-white',
    button: [
      'smarthr-ui-Grouped-Table-trigger',
      'shr-group',
      'shr-font-bold shr-leading-tight',
      'shr-w-full shr-cursor-pointer shr-appearance-none shr-border-none shr-bg-transparent shr-px-1 shr-py-0.75 shr-text-left shr-text-inherit shr-text-color-inherit',
      'disabled:shr-cursor-not-allowed disabled:shr-bg-white-darken disabled:shr-text-disabled',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    contentPushRight: ['shr-text-right', 'shr-tabular-nums'],
    headerCell: '',
  },
  compoundSlots: [
    {
      slots: ['leftIcon'],
      className: 'shr-shrink-0',
    },
  ],
  variants: {
    grouped: {
      true: {
        rowTh: 'shr-p-0 shr-align-top',
      },
      false: {},
    },
    headerPosition: {
      first: { headerCell: 'min-[750px]:shr-pl-1.5' },
      middle: { headerCell: '' },
      last: { headerCell: 'shr-text-right' },
    } satisfies Record<'first' | 'middle' | 'last', { headerCell: string }>,
  },
})

const buildClassNames = (grouped: boolean) => {
  const {
    button,
    title,
    titleWrapper,
    verticalHeader,
    leftIcon,
    rowTh,
    contentPushRight,
    headerCell,
  } = classNameGenerator()

  return {
    button: button(),
    title: title(),
    titleWrapper: titleWrapper(),
    verticalHeader: verticalHeader(),
    leftIcon: leftIcon(),
    rowTh: rowTh({ grouped }),
    contentPushRight: contentPushRight(),
    headerCell: {
      first: headerCell({ headerPosition: 'first' }),
      middle: headerCell({ headerPosition: 'middle' }),
      last: headerCell({ headerPosition: 'last' }),
    },
  }
}

export const TableView = <T extends ChartName>({ data, options }: Props<T>) => {
  // TODO: smarthr-ui-charts自信が翻訳プロバイダーを持つ時入れます
  // const { localize } = useIntl()
  const isGrouped = useMemo(() => {
    const stackIds = new Set(
      data.datasets.map((dataset) => dataset.stack).filter((id) => id !== undefined),
    )
    return stackIds.size > 1
  }, [data.datasets])

  const classNames = useMemo(() => buildClassNames(isGrouped), [isGrouped])

  const topLeftHeader = useMemo(() => {
    const scales = (options as Partial<ChartOptions<'bar' | 'line'>>).scales
    return options?.indexAxis === 'y' ? scales?.y?.title?.text : scales?.x?.title?.text
  }, [options])

  const generateTableData = (): DefaultTableProps['data'] => ({
    headers: [topLeftHeader ?? '', ...(data.datasets?.map((dataset) => dataset.label) ?? [])],
    rows:
      data.labels?.map((label, index) => ({
        label: label as ReactNode,
        values:
          data.datasets?.map((dataset) => {
            return typeof dataset.data?.[index] === 'number' ? dataset.data?.[index] : null
          }) ?? [],
      })) ?? [],
  })

  const generateGroupedTableData = (): GroupedTableProps['data'] => {
    const groupedByStack = new Map<string, typeof data.datasets>()
    data.datasets.forEach((dataset) => {
      if (dataset.stack === undefined) {
        return
      }
      const items = groupedByStack.get(dataset.stack) ?? []
      items.push(dataset)
      groupedByStack.set(dataset.stack, items)
    })

    return {
      headers: [topLeftHeader ?? 'グループ', 'カテゴリー', '合計'],
      groups: [...groupedByStack.entries()].map(([stackId, datasets]) => ({
        label: stackId,
        rows: datasets.map((dataset) => {
          const values = ((dataset.data ?? []) as unknown[]).map((value) =>
            typeof value === 'number' ? value : null,
          )
          return {
            label: dataset.label as ReactNode,
            values: [values.find((value) => value !== null) ?? null],
          }
        }),
      })),
    }
  }

  return (
    <div className="shr-py-0.5">
      {isGrouped ? (
        <GroupedTable
          data={generateGroupedTableData()}
          // TODO: smarthr-ui-charts自信が翻訳プロバイダーを持つ時入れます
          // localize={localize}
          classNames={classNames}
        />
      ) : (
        <DefaultTable data={generateTableData()} classNames={classNames} />
      )}
    </div>
  )
}

const DefaultTable = ({ data, classNames }: DefaultTableProps) => (
  <Table>
    <tbody>
      <tr>
        {data.headers.map((header, index) => (
          <Th key={`header-${index}`} scope="col">
            {header}
          </Th>
        ))}
      </tr>
      {data.rows.map((row, rowIndex) => (
        <tr key={`row-${rowIndex}`}>
          <Th scope="row" className={classNames.rowTh}>
            {row.label}
          </Th>
          {row.values.map((value, cellIndex) => (
            <Td key={`cell-${cellIndex}`}>{value}</Td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
)

const GroupedTable = ({ data, classNames }: GroupedTableProps) => {
  const { headers, groups } = data
  const idPrefix = useId()
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<number>>(new Set())

  const toggleGroup = (groupIndex: number) => {
    setExpandedGroupIds((prev) => {
      const next = new Set(prev)
      if (next.has(groupIndex)) {
        next.delete(groupIndex)
      } else {
        next.add(groupIndex)
      }
      return next
    })
  }

  return (
    <Table className={classNames.verticalHeader}>
      <tbody>
        <tr>
          {headers.map((header, headerIndex) => {
            const isLast = headerIndex === headers.length - 1
            const contentWidth = headerIndex === 0 ? 13 : isLast ? 3 : undefined
            const thClassName =
              headerIndex === 0
                ? classNames.headerCell.first
                : isLast
                  ? classNames.headerCell.last
                  : classNames.headerCell.middle
            return (
              <Th key={`header-${headerIndex}`} contentWidth={contentWidth} className={thClassName}>
                {header}
              </Th>
            )
          })}
        </tr>
        {groups.map((group, groupIndex) => {
          const isExpandable = group.rows.length > 1
          const total =
            group.rows.reduce<number | null>(
              (sum, row) => (row.values[0] === null ? sum : (sum ?? 0) + (row.values[0] ?? 0)),
              null,
            ) ?? 0

          // 項目が1つしかない場合は展開する意味がないため、折りたたみボタンなしで1行だけ表示する
          if (!isExpandable) {
            return (
              <tr key={`row-${groupIndex}`}>
                <Th scope="row" className="!shr-bg-white">
                  {group.label}
                </Th>
                <Td>{group.rows[0]?.label}</Td>
                <Td className={classNames.contentPushRight}>{total}</Td>
              </tr>
            )
          }

          const isExpanded = expandedGroupIds.has(groupIndex)
          const childRowIds = group.rows.map(
            (_, rowIndex) => `${idPrefix}-${groupIndex}-${rowIndex}`,
          )

          return (
            <Fragment key={`row-${groupIndex}`}>
              <tr>
                <Th
                  rowSpan={isExpanded ? group.rows.length + 1 : 1}
                  scope="row"
                  className={classNames.rowTh}
                >
                  <button
                    type="button"
                    className={classNames.button}
                    aria-expanded={isExpanded}
                    aria-controls={childRowIds.join(' ')}
                    onClick={() => toggleGroup(groupIndex)}
                  >
                    <Cluster as="span" align="center" className={classNames.titleWrapper}>
                      <FaCaretRightIcon className={classNames.leftIcon} />
                      <span className={classNames.title}>{group.label}</span>
                    </Cluster>
                  </button>
                </Th>
                <Td>{isExpanded ? '全体' : ''}</Td>
                <Td className={classNames.contentPushRight}>{total}</Td>
              </tr>
              {/* aria-controls の参照先が常に存在するよう、閉じている間も hidden で DOM に残す */}
              {group.rows.map((row, rowIndex) => (
                <tr key={`cell-${rowIndex}`} id={childRowIds[rowIndex]} hidden={!isExpanded}>
                  <Td>
                    <Text size="S">{row.label}</Text>
                  </Td>
                  <Td className={classNames.contentPushRight}>
                    <Text size="S">{row.values[0]}</Text>
                  </Td>
                </tr>
              ))}
            </Fragment>
          )
        })}
      </tbody>
    </Table>
  )
}
