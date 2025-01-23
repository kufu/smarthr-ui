import React, { ComponentProps, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType } from '../../../libs/decorator'
import { FaMagnifyingGlassIcon } from '../../Icon'
import { InputWithTooltip } from '../InputWithTooltip'

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
    const labelStyleAttr = useMemo(
      () => ({
        width: typeof width === 'number' ? `${width}px` : width,
      }),
      [width],
    )
    const { label, input } = searchInput({ existsWidth: !!labelStyleAttr.width })

    return (
      <label className={label({ className })} style={labelStyleAttr}>
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
