import React from 'react'

import { ComponentProps } from 'react'
import { InputWithTooltip } from '../InputWithTooltip'
import { FaSearchIcon } from '../../Icon'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage'> & {
  /** 入力欄の説明 */
  description: React.ReactNode
}

export const SearchInput: React.FC<Props> = ({ description, ...props }) => (
  <InputWithTooltip
    {...props}
    tooltipMessage={description}
    prefix={<FaSearchIcon alt="検索" color="TEXT_GREY" />}
  />
)
