import React from 'react'

import { ComponentProps } from 'react'
import { InputWithTooltip } from '../InputWithTooltip'
import { FaSearchIcon } from '../../Icon'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage'> & {
  /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
}

export const SearchInput: React.FC<Props> = ({ ...props }) => (
  <InputWithTooltip {...props} prefix={<FaSearchIcon alt="検索" color="TEXT_GREY" />} />
)
