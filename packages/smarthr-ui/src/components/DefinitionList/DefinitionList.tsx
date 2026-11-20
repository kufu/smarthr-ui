import { type ComponentPropsWithRef, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

type Props = ComponentPropsWithRef<'dl'>

const classNameGenerator = tv({
  base: 'smarthr-ui-DefinitionList shr-my-[initial]',
})

export const DefinitionList: FC<Props> = ({ children, className, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Cluster {...rest} as="dl" gap={1.5} className={actualClassName}>
      {children}
    </Cluster>
  )
}
