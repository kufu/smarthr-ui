'use client'

import { useTheme } from '../../../hooks/client/useTheme'
import { Stack } from '../../Layout'

import type { FC, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  className?: string
  fullWidth?: boolean
  maxColumns?: number
}>

export const ItemWrapper: FC<Props> = ({ children, className, maxColumns, fullWidth }) => {
  const theme = useTheme()

  return (
    <Stack
      gap={0.25}
      className={className}
      style={{
        flexBasis:
          // fullWidth の方が強い
          !fullWidth && maxColumns
            ? `calc((100% - ${theme.spacingByChar(1.5)} * ${maxColumns - 1}) / ${maxColumns})`
            : undefined,
      }}
    >
      {children}
    </Stack>
  )
}
