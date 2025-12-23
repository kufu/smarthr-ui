import {
  Children,
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactElement,
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

type AbstractProps = PropsWithChildren<{
  /** 定義リストのアイテムの配列
   * @deprecated DefinitionListItem を使ってください
   */
  items?: Array<Omit<ItemType, 'termStyleType'>>
  /** 最大列数 */
  maxColumns?: number
  /** 用語の見た目の種類 */
  termStyleType?: ItemType['termStyleType']
}>
type Props = AbstractProps & Omit<ComponentProps<'dl'>, keyof AbstractProps>

const classNameGenerator = tv({
  base: 'smarthr-ui-DefinitionList shr-my-[initial]',
})

export const DefinitionList: FC<Props> = ({
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
      {Children.map(
        children,
        (child) =>
          isValidElement(child) &&
          cloneElement(child as ReactElement, {
            maxColumns,
            termStyleType,
          }),
      )}
    </Cluster>
  )
}
