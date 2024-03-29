import React, { ComponentProps, forwardRef, useMemo } from 'react'

import { FaSearchIcon } from '../../Icon'
import { InputWithTooltip } from '../InputWithTooltip'

import type { DecoratorsType } from '../../../types'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage' | 'prefix'> & {
  /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
  decorators?: DecoratorsType<'iconAlt'>
}

const ICON_ALT = '検索'

export const SearchInput = forwardRef<HTMLInputElement, Props>(({ decorators, ...props }, ref) => {
  const iconAlt = useMemo(() => decorators?.iconAlt?.(ICON_ALT) || ICON_ALT, [decorators])

  return (
    <label>
      <InputWithTooltip
        {...props}
        ref={ref}
        prefix={<FaSearchIcon alt={iconAlt} color="TEXT_GREY" />}
      />
    </label>
  )
})
