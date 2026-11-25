'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
  createContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

type ListDividerWidth = 'full' | 'content'

/**
 * 区切り線の指定方法
 *
 * - `'full'` / `'content'`: 区切り線の幅だけを指定する。最後のアイテムの下には引かない
 * - `{ width, last }`: 幅に加えて、最後のアイテムの下に引くかを指定する
 * - `false`: 引かない
 */
type ListDividerModifier = ListDividerWidth | false | { width: ListDividerWidth; last?: boolean }

type AbstractProps = {
  /**
   * 各アイテムの下に引く区切り線
   *
   * - `'full'`: アイテムの幅いっぱいに引く
   * - `'content'`: アイテムの左右の余白（`padding`）を除いた、内容と同じ幅で引く
   * - `{ width, last }`: `width` に上記のいずれかを指定する。`last: true` にすると最後のアイテムの下にも引く（既定値は `false`）
   * - `false`: 引かない
   *
   * スクロール領域に配置する場合など、リストの終わりを示したい場合は `last: true` を指定してください
   *
   * @default 'full'
   */
  divider?: ListDividerModifier
  /** リストに並べるアイテム。`ListItem` または `ListItemAnchor` を配置してください */
  children?: ReactNode
}

type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'ul'>, keyof AbstractProps>

type ListDivider = {
  width: ListDividerWidth | false
  last: boolean
}

// HINT: 区切り線はリスト単位で揃えるため、ListItemはdividerをpropsではなくこのcontextから受け取る
export const ListDividerContext = createContext<ListDivider>({ width: 'full', last: false })

const classNameGenerator = tv({
  base: ['smarthr-ui-List', 'shr-flex shr-flex-col'],
})

export const List: FC<Props> = ({ className, divider = 'full', children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  // HINT: dividerはインラインのオブジェクトで渡されうるため、プリミティブ値に分解してからcontextの値を作る
  const dividerWidth = typeof divider === 'object' ? divider.width : divider
  const dividerLast = typeof divider === 'object' ? (divider.last ?? false) : false
  const dividerContextValue = useMemo(
    () => ({ width: dividerWidth, last: dividerLast }),
    [dividerWidth, dividerLast],
  )
  return (
    <ListDividerContext.Provider value={dividerContextValue}>
      <ul {...rest} className={actualClassName}>
        {children}
      </ul>
    </ListDividerContext.Provider>
  )
}
