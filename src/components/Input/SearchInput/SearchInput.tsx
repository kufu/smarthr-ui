import React, { ComponentProps, forwardRef } from 'react'

import { FaSearchIcon } from '../../Icon'
import { InputWithTooltip } from '../InputWithTooltip'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage' | 'prefix'> & {
  /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
}

export const SearchInput = forwardRef<HTMLInputElement, Props>((props, ref) => (
  <label>
    <InputWithTooltip {...props} ref={ref} prefix={<FaSearchIcon alt="検索" color="TEXT_GREY" />} />
  </label>
))
