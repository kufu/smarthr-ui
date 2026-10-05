import { type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

// TODO: ComponentPropsWithRef<'dl'>に修正し、dlが受け取れる属性をすべて設定可能にする
type Props = PropsWithChildren<{
  className?: string
}>

const classNameGenerator = tv({
  base: 'smarthr-ui-DefinitionList shr-my-[initial]',
})

export const DefinitionList: FC<Props> = ({ children, className }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Cluster as="dl" gap={1.5} className={actualClassName}>
      {children}
    </Cluster>
  )
}
