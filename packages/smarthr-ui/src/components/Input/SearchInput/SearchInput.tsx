import { type ComponentPropsWithRef, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../../intl'
import { FaMagnifyingGlassIcon } from '../../Icon'
import { InputWithTooltip } from '../InputWithTooltip'

type Props = Omit<ComponentPropsWithRef<typeof InputWithTooltip>, 'prefix'>

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

export const SearchInput: FC<Props> = ({ width, className, ...rest }) => {
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
        className={classNames.input}
        prefix={
          <FaMagnifyingGlassIcon
            alt={<Localizer id="smarthr-ui/SearchInput/iconAlt" defaultText="検索" />}
            color="TEXT_GREY"
          />
        }
      />
    </label>
  )
}
