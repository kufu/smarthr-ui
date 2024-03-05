import React, { ComponentProps, FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

import { DefinitionListItem } from './DefinitionListItem'

type Props = {
  /** 定義リストのアイテムの配列 */
  items: Array<ComponentProps<typeof DefinitionListItem>>
  /** 最大列数 */
  maxColumns?: number
}
type ElementProps = Omit<ComponentProps<'dl'>, keyof Props>

const definitionList = tv({
  base: 'smarthr-ui-DefinitionList shr-my-[initial]',
})

export const DefinitionList: FC<Props & ElementProps> = ({ items, maxColumns, className }) => {
  const styles = useMemo(() => definitionList({ className }), [className])

  return (
    <Cluster as="dl" gap={1.5} className={styles}>
      {items.map((item, index) => (
        <DefinitionListItem {...item} key={index} maxColumns={maxColumns} />
      ))}
    </Cluster>
  )
}
