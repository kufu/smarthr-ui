import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Cluster } from '../Layout'

import { DefinitionListColumnGapProvider } from './client'

import type { ExtendElementPropsWithRef, PositiveGap, SeparatePositiveGap } from '../../types'

type Props = ExtendElementPropsWithRef<
  'dl',
  {
    gap?: PositiveGap | SeparatePositiveGap
  }
>

const classNameGenerator = tv({
  base: 'smarthr-ui-DefinitionList shr-my-[initial]',
})

export const DefinitionList: FC<Props> = ({ gap = 1.5, children, className, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])
  const columnGap = gap instanceof Object ? gap.column : gap

  return (
    <DefinitionListColumnGapProvider gap={columnGap}>
      <Cluster {...rest} as="dl" gap={gap} className={actualClassName}>
        {children}
      </Cluster>
    </DefinitionListColumnGapProvider>
  )
}
