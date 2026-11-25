'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
  createContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

type ListDivider = 'full' | 'content' | false

type AbstractProps = {
  /**
   * 各アイテムの下に引く区切り線
   *
   * - `'full'`: アイテムの幅いっぱいに引く
   * - `'content'`: アイテムの左右の余白（`padding`）を除いた、内容と同じ幅で引く
   * - `false`: 引かない
   *
   * @default 'full'
   */
  divider?: ListDivider
  /** リストに並べるアイテム。`ListItem` または `ListItemAnchor` を配置してください */
  children?: ReactNode
}

type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'ul'>, keyof AbstractProps>

// HINT: 区切り線はリスト単位で揃えるため、ListItemはdividerをpropsではなくこのcontextから受け取る
export const ListDividerContext = createContext<ListDivider>('full')

const classNameGenerator = tv({
  base: ['smarthr-ui-List', 'shr-flex shr-flex-col'],
})

export const List: FC<Props> = ({ className, divider = 'full', children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  return (
    <ListDividerContext.Provider value={divider}>
      <ul {...rest} className={actualClassName}>
        {children}
      </ul>
    </ListDividerContext.Provider>
  )
}
