import React, { type ComponentProps, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { FaArrowLeftIcon } from '../Icon'
import { TextLink } from '../TextLink'

const styleGenerator = tv({
  base: 'shr-leading-none',
  variants: {
    indent: {
      true: '-shr-translate-x-1.25',
      false: '',
    },
  },
})

type Props = Omit<ComponentProps<typeof TextLink>, 'prefix' | 'suffix'> &
  VariantProps<typeof styleGenerator> & {
    /** `TextLink`に渡す `elementAs` をオプションで指定 */
    elementAs?: ComponentProps<typeof TextLink>['elementAs']
  }

export const UpwardLink: React.FC<Props> = ({ indent = true, className, elementAs, ...rest }) => {
  const actualClassName = useMemo(() => styleGenerator({ indent, className }), [indent, className])

  return (
    <div className={actualClassName}>
      <TextLink {...rest} elementAs={elementAs} prefix={<FaArrowLeftIcon />} />
    </div>
  )
}
