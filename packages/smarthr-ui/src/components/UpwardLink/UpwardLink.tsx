import React, { type ComponentProps } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { FaArrowLeftIcon } from '../Icon'
import { TextLink } from '../TextLink'

const upwardLink = tv({
  base: 'shr-leading-none',
  variants: {
    indent: {
      true: '-shr-translate-x-1.25',
      false: '',
    },
  },
})

type Props = Omit<ComponentProps<typeof TextLink>, 'prefix' | 'suffix'> &
  VariantProps<typeof upwardLink> & {
    /** `TextLink`に渡す `elementAs` をオプションで指定 */
    elementAs?: ComponentProps<typeof TextLink>['elementAs']
  }

export const UpwardLink: React.FC<Props> = ({ indent = true, className, elementAs, ...rest }) => {
  const style = upwardLink({ indent, className })
  return (
    <div className={style}>
      <TextLink {...rest} elementAs={elementAs} prefix={<FaArrowLeftIcon />} />
    </div>
  )
}
