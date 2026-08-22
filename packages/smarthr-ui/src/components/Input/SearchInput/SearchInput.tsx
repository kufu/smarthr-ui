import { type ComponentProps, type ReactNode, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { InputWithTooltip } from '../InputWithTooltip'

import { SearchInputIcon } from './SearchInputIcon'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage' | 'prefix'> & {
  /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
  tooltipMessage: ReactNode
}

const classNameGenerator = tv({
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
  ({ width, className, ...rest }, ref) => {
    const labelStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
    }
    const existsWidth = !!labelStyle.width

    const classNames = useMemo(() => {
      const { label, input } = classNameGenerator({ existsWidth })

      return {
        label: label({ className }),
        input: input(),
      }
    }, [existsWidth, className])

    return (
      <label className={classNames.label} style={labelStyle}>
        <InputWithTooltip
          {...rest}
          ref={ref}
          className={classNames.input}
          prefix={<SearchInputIcon />}
        />
      </label>
    )
  },
)
