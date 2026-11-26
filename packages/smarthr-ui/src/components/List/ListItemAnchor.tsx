import { FaChevronRightIcon } from '../Icon'

import { ListItem, type ListItemPaddingModifier, type ListItemProps } from './client'

import type { ComponentPropsWithoutRef, ElementType, FC, ReactNode } from 'react'

type Props<Slot extends ElementType<{ className?: string; children?: ReactNode }>> = Omit<
  ListItemProps<Slot>,
  'action' | 'padding' | 'slot'
> & {
  /**
   * リンク先。`slot.renderer` に渡される
   *
   * `undefined` の場合はhrefを持たない要素になり、無効なリンクとして扱われる
   */
  href: ComponentPropsWithoutRef<'a'>['href']
  /**
   * アイテム内側の余白。指定方法は `ListItem` と同じ
   *
   * @default { inline: { end: 0.5 } }
   */
  padding?: ListItemPaddingModifier
  /**
   * リンクとして描画する要素。ルーティングライブラリのLinkコンポーネントなどを使う場合に `renderer` に指定する
   *
   * @default { renderer: 'a' }
   */
  slot?: { renderer: Slot; props?: ComponentPropsWithoutRef<Slot> }
}

type ListItemAnchor = <Slot extends ElementType<{ className?: string; children?: ReactNode }>>(
  props: Props<Slot>,
) => ReturnType<FC>

const DEFAULT_PADDING: ListItemPaddingModifier = { inline: { end: 0.5 } }

export const ListItemAnchor: ListItemAnchor = <
  Slot extends ElementType<{ className?: string; children?: ReactNode }>,
>({
  slot,
  href,
  padding = DEFAULT_PADDING,
  ...rest
}: Props<Slot>) => {
  const slotRenderer = slot?.renderer || 'a'
  const slotProps = { ...slot?.props, href }
  return (
    <ListItem
      {...rest}
      slot={{ renderer: slotRenderer, props: slotProps }}
      action={<FaChevronRightIcon color="TEXT_LINK" />}
      padding={padding}
    />
  )
}
