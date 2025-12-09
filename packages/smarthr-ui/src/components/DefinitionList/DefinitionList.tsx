import {
  Children,
  type ComponentProps,
  type FC,
  Fragment,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

import { DefinitionListItem } from './DefinitionListItem'

type ItemType = ComponentProps<typeof DefinitionListItem>

// TODO: maxColumns, termStyleTypeはDefinitionListItemに引きつかず、
// DefinitionListにdata属性として設定することでDefinitionListItemから参照できるようにするほうが良いかも？

type Props = PropsWithChildren<{
  /** 定義リストのアイテムの配列
   * @deprecated DefinitionListItem を使ってください
   */
  items?: Array<Omit<ItemType, 'termStyleType'>>
  /** 最大列数 */
  maxColumns?: number
  /** 用語の見た目の種類 */
  termStyleType?: ItemType['termStyleType']
}>
type ElementProps = Omit<ComponentProps<'dl'>, keyof Props>

const classNameGenerator = tv({
  base: 'smarthr-ui-DefinitionList shr-my-[initial]',
})

// children のうち DefinitionListItem にだけ maxColumns / termStyleType を注入して返す
function childrenToItems(
  children: ReactNode,
  extra: Pick<ItemType, 'maxColumns' | 'termStyleType'>,
): ReactNode[] {
  const out: ReactNode[] = []

  const walk = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) {
        out.push(child)
        return
      }

      if (child.type === Fragment) {
        walk(child.props.children) // Fragment は再帰的に展開
        return
      }

      // DefinitionListItem にだけ追加 props を注入
      if (child.type === DefinitionListItem) {
        out.push(cloneElement(child, extra))
      } else {
        out.push(child) // 他の要素はそのまま
      }
    })
  }

  walk(children)
  return out
}

export const DefinitionList: FC<Props & ElementProps> = ({
  items,
  maxColumns,
  termStyleType,
  children,
  className,
}) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Cluster as="dl" gap={1.5} className={actualClassName}>
      {items &&
        items.map((item, index) => (
          <DefinitionListItem
            {...item}
            key={index}
            maxColumns={maxColumns}
            termStyleType={termStyleType}
          />
        ))}
      {childrenToItems(children, { maxColumns, termStyleType })}
    </Cluster>
  )
}
