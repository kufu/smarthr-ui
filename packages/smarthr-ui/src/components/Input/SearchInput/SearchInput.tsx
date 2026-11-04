import { type ComponentPropsWithRef, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../../intl'
import { FaMagnifyingGlassIcon } from '../../Icon'
import { InputWithTooltip } from '../InputWithTooltip'

import { AiMagnifyingGlassIcon } from './AiMagnifyingGlassIcon'

type Props = Omit<ComponentPropsWithRef<typeof InputWithTooltip>, 'prefix'> & {
  /**
   * `'ai'` のとき、検索アイコンをAIサービスのブランドカラー(グラデーション)で表示する
   */
  variant?: 'ai'
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

export const SearchInput: FC<Props> = ({ width, className, variant, ...rest }) => {
  const labelStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
  }
  const existsWidth = !!labelStyle.width

  const classNames = useMemo(() => {
    const { label, input } = classNameGenerator()

    return {
      label: label({ className }),
      input: input({ existsWidth }),
    }
  }, [existsWidth, className])

  return (
    <label className={classNames.label} style={labelStyle}>
      <InputWithTooltip
        {...rest}
        className={classNames.input}
        prefix={
          variant === 'ai' ? (
            <AiMagnifyingGlassIcon
              alt={<Localizer id="smarthr-ui/SearchInput/iconAlt" defaultText="検索" />}
            />
          ) : (
            <FaMagnifyingGlassIcon
              alt={<Localizer id="smarthr-ui/SearchInput/iconAlt" defaultText="検索" />}
            />
          )
        }
      />
    </label>
  )
}
