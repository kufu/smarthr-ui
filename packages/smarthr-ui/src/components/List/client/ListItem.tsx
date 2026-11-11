'use client'

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../../Heading'
import { Cluster, Stack } from '../../Layout'
import { SectioningFragment } from '../../SectioningContent'
import { Text } from '../../Text'

import { ListDividerContext } from './List'

/** アイテム内側の余白の大きさ。テーマのスペーシングの値に対応する */
type ListItemPadding = 0 | 0.25 | 0.5 | 1 | 1.5

/**
 * アイテム内側の余白の指定方法
 *
 * - 数値: 上下左右をまとめて指定する
 * - `{ block, inline }` に数値: 上下（block）と左右（inline）をそれぞれ指定する
 * - `{ block: { start, end }, inline: { start, end } }`: 各辺を個別に指定する
 *
 * 指定しなかった方向・辺は既定値の `1` になる
 */
export type ListItemPaddingModifier =
  | ListItemPadding
  | {
      block?: ListItemPadding
      inline?: ListItemPadding
    }
  | {
      block?: {
        start?: ListItemPadding
        end?: ListItemPadding
      }
      inline?: {
        start?: ListItemPadding
        end?: ListItemPadding
      }
    }

/** ListItemPaddingModifierを各辺の値に展開したもの */
type Padding = {
  paddingBlockStart: ListItemPadding
  paddingBlockEnd: ListItemPadding
  paddingInlineStart: ListItemPadding
  paddingInlineEnd: ListItemPadding
}

const defaultPadding: Padding = {
  paddingBlockStart: 1,
  paddingBlockEnd: 1,
  paddingInlineStart: 1,
  paddingInlineEnd: 1,
} as const

// paddingの3通りの指定方法を、tvのvariantsに渡せる各辺の値に揃える
const mapPaddingModifierToPadding = (paddingModifier: ListItemPaddingModifier): Padding => {
  if (paddingModifier === undefined) {
    return defaultPadding
  }
  if (typeof paddingModifier === 'number') {
    return {
      ...defaultPadding,
      paddingBlockStart: paddingModifier,
      paddingBlockEnd: paddingModifier,
      paddingInlineStart: paddingModifier,
      paddingInlineEnd: paddingModifier,
    }
  }
  if (typeof paddingModifier.block === 'number' || typeof paddingModifier.inline === 'number') {
    return {
      ...defaultPadding,
      paddingBlockStart:
        typeof paddingModifier.block === 'number'
          ? paddingModifier.block
          : defaultPadding.paddingBlockStart,
      paddingBlockEnd:
        typeof paddingModifier.block === 'number'
          ? paddingModifier.block
          : defaultPadding.paddingBlockEnd,
      paddingInlineStart:
        typeof paddingModifier.inline === 'number'
          ? paddingModifier.inline
          : defaultPadding.paddingInlineStart,
      paddingInlineEnd:
        typeof paddingModifier.inline === 'number'
          ? paddingModifier.inline
          : defaultPadding.paddingInlineEnd,
    }
  }
  return {
    paddingBlockStart: paddingModifier.block?.start ?? defaultPadding.paddingBlockStart,
    paddingBlockEnd: paddingModifier.block?.end ?? defaultPadding.paddingBlockEnd,
    paddingInlineStart: paddingModifier.inline?.start ?? defaultPadding.paddingInlineStart,
    paddingInlineEnd: paddingModifier.inline?.end ?? defaultPadding.paddingInlineEnd,
  }
}

type AbstractProps<Slot extends ElementType<{ className?: string; children?: ReactNode }>> = {
  /**
   * アイテム内側の余白。数値で上下左右をまとめて、`block`/`inline` で上下と左右を、
   * さらに `start`/`end` で各辺を個別に指定できる
   *
   * @default 1
   */
  padding?: ListItemPaddingModifier
  /**
   * アイテムの内容を包む要素。`renderer` に描画する要素またはコンポーネントを、`props` にそのpropsを指定する
   *
   * @default { renderer: 'div' }
   */
  slot?: { renderer: Slot; props?: ComponentPropsWithoutRef<Slot> }
  /** 見出しの上に表示するステータス。`StatusLabel` などを配置する */
  status?: ReactNode
  /** アイテムの見出し。`Heading` として描画され、見出しレベルは周囲のセクションから自動で決まる */
  heading: ReactNode
  /** アイテムの右端に配置する操作。`Button` などを配置する */
  action?: ReactNode
  /** 見出しの下に表示する説明。省略した場合は説明の領域ごと描画しない */
  children?: ReactNode
}

type ElementProps<Slot extends ElementType<{ className?: string; children?: ReactNode }>> = Omit<
  ComponentPropsWithoutRef<'li'>,
  keyof AbstractProps<Slot>
>

export type ListItemProps<Slot extends ElementType<{ className?: string; children?: ReactNode }>> =
  AbstractProps<Slot> & ElementProps<Slot>

// HINT: 区切り線は::after疑似要素のborderで引く。divider="content"のときは疑似要素に
// アイテムの左右のpaddingと同じ値のmarginを付け、内容と同じ幅に揃える
const classNameGenerator = tv({
  slots: {
    li: ['smarthr-ui-ListItem', 'shr-flex shr-list-none shr-flex-col shr-bg-white'],
    slot: 'shr-no-underline focus-visible:shr-focus-indicator [&[href]:hover]:shr-bg-white-darken',
    content: 'shr-flex shr-flex-col [:focus-visible>&]:shr-focus-indicator',
  },
  variants: {
    divider: {
      full: {
        li: 'after:shr-border-b-shorthand after:shr-flex after:shr-flex-col after:shr-content-[""]',
      },
      content: {
        li: 'after:shr-border-b-shorthand after:shr-flex after:shr-flex-col after:shr-content-[""]',
      },
      false: {},
    },
    paddingBlockStart: {
      0: {
        content: 'shr-pt-0',
      },
      0.25: {
        content: 'shr-pt-0.25',
      },
      0.5: {
        content: 'shr-pt-0.5',
      },
      1: {
        content: 'shr-pt-1',
      },
      1.5: {
        content: 'shr-pt-1.5',
      },
    },
    paddingBlockEnd: {
      0: {
        content: 'shr-pb-0',
      },
      0.25: {
        content: 'shr-pb-0.25',
      },
      0.5: {
        content: 'shr-pb-0.5',
      },
      1: {
        content: 'shr-pb-1',
      },
      1.5: {
        content: 'shr-pb-1.5',
      },
    },
    paddingInlineStart: {
      0: {
        content: 'shr-ps-0',
      },
      0.25: {
        content: 'shr-ps-0.25',
      },
      0.5: {
        content: 'shr-ps-0.5',
      },
      1: {
        content: 'shr-ps-1',
      },
      1.5: {
        content: 'shr-ps-1.5',
      },
    },
    paddingInlineEnd: {
      0: {
        content: 'shr-pe-0',
      },
      0.25: {
        content: 'shr-pe-0.25',
      },
      0.5: {
        content: 'shr-pe-0.5',
      },
      1: {
        content: 'shr-pe-1',
      },
      1.5: {
        content: 'shr-pe-1.5',
      },
    },
  },
  compoundVariants: [
    {
      divider: 'content',
      paddingInlineStart: 0,
      className: {
        li: 'after:shr-ms-0',
      },
    },
    {
      divider: 'content',
      paddingInlineStart: 0.25,
      className: {
        li: 'after:shr-ms-0.25',
      },
    },
    {
      divider: 'content',
      paddingInlineStart: 0.5,
      className: {
        li: 'after:shr-ms-0.5',
      },
    },
    {
      divider: 'content',
      paddingInlineStart: 1,
      className: {
        li: 'after:shr-ms-1',
      },
    },
    {
      divider: 'content',
      paddingInlineStart: 1.5,
      className: {
        li: 'after:shr-ms-1.5',
      },
    },
    {
      divider: 'content',
      paddingInlineEnd: 0,
      className: {
        li: 'after:shr-me-0',
      },
    },
    {
      divider: 'content',
      paddingInlineEnd: 0.25,
      className: {
        li: 'after:shr-me-0.25',
      },
    },
    {
      divider: 'content',
      paddingInlineEnd: 0.5,
      className: {
        li: 'after:shr-me-0.5',
      },
    },
    {
      divider: 'content',
      paddingInlineEnd: 1,
      className: {
        li: 'after:shr-me-1',
      },
    },
    {
      divider: 'content',
      paddingInlineEnd: 1.5,
      className: {
        li: 'after:shr-me-1.5',
      },
    },
  ],
})

type ListItem = <Slot extends ElementType<{ className?: string; children?: ReactNode }>>(
  props: ListItemProps<Slot>,
) => ReturnType<FC>

export const ListItem: ListItem = <
  Slot extends ElementType<{ className?: string; children?: ReactNode }>,
>({
  padding = 1,
  status,
  heading,
  action,
  className,
  children,
  slot,
  ...rest
}: ListItemProps<Slot>) => {
  const divider = useContext(ListDividerContext)
  const { paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd } =
    mapPaddingModifierToPadding(padding)
  const slotClassName = slot?.props?.className
  const actualClassName = useMemo(() => {
    const classNames = classNameGenerator()
    return {
      li: classNames.li({
        className,
        divider,
        paddingBlockStart,
        paddingBlockEnd,
        paddingInlineStart,
        paddingInlineEnd,
      }),
      slot: classNames.slot({ className: slotClassName }),
      content: classNames.content({
        paddingBlockStart,
        paddingBlockEnd,
        paddingInlineStart,
        paddingInlineEnd,
      }),
    }
  }, [
    className,
    slotClassName,
    divider,
    paddingBlockStart,
    paddingBlockEnd,
    paddingInlineStart,
    paddingInlineEnd,
  ])
  const SlotRenderer = slot?.renderer ?? 'div'

  return (
    <li {...rest} className={actualClassName.li}>
      <SectioningFragment>
        {/* @ts-expect-error 型が複雑で推論できないため */}
        <SlotRenderer {...slot?.props} className={actualClassName.slot}>
          <div className={actualClassName.content}>
            <Cluster grow="start" align="center">
              <Stack align="start" gap={0.5}>
                {status}
                <Heading className="shr-inline-flex">
                  <Text size="M" leading="NORMAL" className="shr-inline-block">
                    {heading}
                  </Text>
                </Heading>
                {children && (
                  <Text as="div" size="S" leading="TIGHT" color="TEXT_GREY">
                    {children}
                  </Text>
                )}
              </Stack>
              {action}
            </Cluster>
          </div>
        </SlotRenderer>
      </SectioningFragment>
    </li>
  )
}
