'use client'

import { useTheme } from '../../../hooks/client/useTheme'
import { Stack } from '../../Layout'

import type { SHRComponentPropsWithRef } from '../../../types'
import type { FC } from 'react'

type Props = SHRComponentPropsWithRef<
  'div',
  {
    fullWidth?: boolean
    maxColumns?: number
  }
>

export const ItemWrapper: FC<Props> = ({ children, maxColumns, fullWidth, ...rest }) => {
  const theme = useTheme()

  return (
    <Stack
      {...rest}
      gap={0.25}
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
