import dayjs from 'dayjs'
import { type ComponentProps, type PropsWithChildren, type ReactNode, useId, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster, Sidebar, Stack } from '../Layout'
import { Section } from '../SectioningContent'
import { Text } from '../Text'

type Props = PropsWithChildren<{
  datetime: Date | string
  /** 日付の代わりに表示するテキスト */
  dateLabel?: string
  /** 時刻のフォーマット */
  timeFormat?: 'HH:mm:ss' | 'HH:mm' | 'none'
  /** 日付のサフィックス領域 */
  dateSuffixArea?: ReactNode
  /** サイドアクション領域 */
  sideActionArea?: ReactNode
  /** 現在のアイテムかどうか */
  current?: boolean
}>
type ElementProps = Omit<
  ComponentProps<typeof Stack>,
  keyof Props | 'inline' | 'gap' | 'align' | 'as'
>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-TimelineItem',
      // mark(1) + 余白(0.75) の分だけ padding
      'shr-relative shr-pl-[calc(theme(spacing[1])+theme(spacing[0.75]))]',
      'has-[+_&]:shr-pb-2',
      'before:shr-absolute before:-shr-bottom-0.5 before:shr-left-[calc(theme(spacing[0.5])-1px)] before:shr-h-full before:shr-w-[2px] before:shr-bg-border',
      // 最後のアイテムには線を引かない
      '[&:not(:last-child)]:before:shr-content-[""]',
      'forced-colors:before:shr-bg-[ButtonBorder]',
    ],
    header: [
      'shr-relative',
      // 日付と中央寄せにしやすくするために mark は header に配置
      'before:shr-absolute before:-shr-left-[calc(theme(spacing[1])+theme(spacing[0.75]))] before:shr-size-1 before:shr-rounded-full before:shr-bg-border before:shr-content-[""]',
      'forced-colors:before:shr-bg-[ButtonBorder]',
      // header が折り返されたときにも線が途切れないように
      'after:shr-absolute after:-shr-left-[calc(theme(spacing[1.25])+1px)] after:shr-top-0 after:shr-h-1/2 after:shr-w-[2px] after:shr-bg-border',
      'forced-colors:after:shr-bg-[ButtonBorder]',
      '[.smarthr-ui-TimelineItem:not(:first-child)]:after:shr-content-[""]',
    ],
  },
  variants: {
    current: {
      true: {
        header: [
          'before:shr-z-1 before:shr-bg-main before:shr-shadow-[0_0_0_2px_white,0_0_0_4px_theme(colors.main)]',
          'forced-colors:before:shr-bg-[Mark]',
        ],
      },
    },
  },
})

export const TimelineItem: React.FC<Props & ElementProps> = ({
  datetime,
  dateLabel,
  timeFormat = 'HH:mm',
  dateSuffixArea,
  sideActionArea,
  children,
  current,
  className,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { wrapper, header } = classNameGenerator({
      current: !!current,
    })
    return {
      wrapper: wrapper({ className }),
      header: header(),
    }
  }, [current, className])

  const { date, time, isoString } = useMemo(() => {
    const d = dayjs(datetime)
    return {
      date: d.format('YYYY/MM/DD'),
      time: timeFormat !== 'none' && d.format(timeFormat),
      isoString: d.toISOString(),
    }
  }, [datetime, timeFormat])

  const id = useId()

  return (
    <Stack {...rest} as="li" gap={0.5} aria-current={current} className={classNames.wrapper}>
      <Cluster align="center" justify="space-between" className={classNames.header}>
        <Sidebar align="center" gap={0.5} className="shr-grow">
          <Cluster align="center" as="time" dateTime={isoString} id={id}>
            <Text styleType="blockTitle" leading="NONE">
              {dateLabel || date}
            </Text>
            {time && <Text leading="NONE">{time}</Text>}
          </Cluster>
          {dateSuffixArea && <div>{dateSuffixArea}</div>}
        </Sidebar>
        {sideActionArea}
      </Cluster>
      {children && (
        // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
        <Section aria-labelledby={id}>{children}</Section>
      )}
    </Stack>
  )
}
