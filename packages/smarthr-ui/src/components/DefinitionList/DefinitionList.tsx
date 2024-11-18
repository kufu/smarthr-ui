import React, { ComponentProps, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

import { DefinitionListItem } from './DefinitionListItem'

type ItemType = ComponentProps<typeof DefinitionListItem>

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

const definitionList = tv({
  base: 'smarthr-ui-DefinitionList shr-my-[initial]',
})

export const DefinitionList: FC<Props & ElementProps> = ({
  items,
  maxColumns,
  termStyleType,
  children,
  className,
}) => {
  const styles = useMemo(() => definitionList({ className }), [className])

  return (
    <Cluster as="dl" gap={1.5} className={styles}>
      {items &&
        items.map((item, index) => (
          <DefinitionListItem
            {...item}
            key={index}
            maxColumns={maxColumns}
            termStyleType={termStyleType}
          />
        ))}
      {React.Children.map(
        children,
        (child) =>
          React.isValidElement(child) &&
          React.cloneElement(child as React.ReactElement, {
            maxColumns,
            termStyleType,
          }),
      )}
    </Cluster>
  )
}
