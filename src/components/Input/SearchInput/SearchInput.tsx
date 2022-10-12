import React from 'react'

import { ComponentProps } from 'react'
import { InputWithTooltip } from '../InputWithTooltip'
import { FaSearchIcon } from '../../Icon'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage' | 'prefix'> & {
  /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
}

export const SearchInput: React.FC<Props> = ({ ...props }) => (
  <label>
    <InputWithTooltip {...props} prefix={<FaSearchIcon alt="検索" color="TEXT_GREY" />} />
  </label>
)
