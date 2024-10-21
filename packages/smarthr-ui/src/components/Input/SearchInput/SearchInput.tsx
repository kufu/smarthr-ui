import React, { ComponentProps, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaMagnifyingGlassIcon } from '../../Icon'
import { InputWithTooltip } from '../InputWithTooltip'

import type { DecoratorsType } from '../../../types'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage' | 'prefix'> & {
  /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
  decorators?: DecoratorsType<'iconAlt'>
}

const ICON_ALT = '検索'

const searchInput = tv({
  slots: {
    label: 'shr-inline-block',
    input: '',
  },
  variants: {
    existsWidth: {
      true: {
        // Tooltip > Input の構成になっているため、内部の幅を広げる
        input: 'shr-w-full [&_.smarthr-ui-Input]:shr-w-full',
      },
    },
  },
})

export const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ decorators, width, className, ...rest }, ref) => {
    const iconAlt = useMemo(() => decorators?.iconAlt?.(ICON_ALT) || ICON_ALT, [decorators])
    const labelWidth = typeof width === 'number' ? `${width}px` : width
    const { label, input } = searchInput({ existsWidth: !!labelWidth })

    return (
      <label className={label({ className })} style={{ width: labelWidth }}>
        <InputWithTooltip
          {...rest}
          ref={ref}
          prefix={<FaMagnifyingGlassIcon alt={iconAlt} color="TEXT_GREY" />}
          className={input()}
        />
      </label>
    )
  },
)
