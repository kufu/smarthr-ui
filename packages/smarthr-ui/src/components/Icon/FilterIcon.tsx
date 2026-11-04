import { type FC, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaFilterIcon } from './FaIcon'
import { FilterCheckIcon } from './client'

import type { ExtendElementPropsWithRef } from '../../types'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Icon-extended',
    'shr-relative shr-leading-none',
    'data-[checked=true]:shr-text-main',
  ],
})

type Props = ExtendElementPropsWithRef<
  'span',
  {
    alt?: ReactNode
    checked?:
      | boolean
      | {
          alt?: string
        }
  }
>

export const FilterIcon: FC<Props> = ({ checked, alt, className, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <span {...rest} className={actualClassName} data-checked={!!checked}>
      <FaFilterIcon alt={alt} />
      {checked && <FilterCheckIcon alt={typeof checked === 'object' ? checked.alt : undefined} />}
    </span>
  )
}
