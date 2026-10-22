'use client'

import { useContext } from 'react'

import { Stack } from '../../Layout'

import { DefinitionListColumnGapContext } from './DefinitionListColumnGapContext'

import type { ExtendElementPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = ExtendElementPropsWithRef<
  'div',
  {
    fullWidth?: boolean
    maxColumns?: number
  }
>

export const ItemWrapper: FC<Props> = ({ children, maxColumns, fullWidth, style, ...rest }) => {
  const columnGap = useContext(DefinitionListColumnGapContext)

  return (
    <Stack
      {...rest}
      gap={0.25}
      style={{
        ...style,
        flexBasis:
          // style.flexBasis が指定されていればそちらを優先する
          style?.flexBasis ??
          // fullWidth の方が強い
          (!fullWidth && maxColumns && columnGap
            ? `calc((100% - ${columnGap} * ${maxColumns - 1}) / ${maxColumns})`
            : undefined),
      }}
    >
      {children}
    </Stack>
  )
}
