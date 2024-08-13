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
  VariantProps<typeof upwardLink>

export const UpwardLink: React.FC<Props> = ({ indent = true, className, ...rest }) => {
  const style = upwardLink({ indent, className })
  return (
    <div className={style}>
      {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
      <TextLink {...rest} prefix={<FaArrowLeftIcon />} />
    </div>
  )
}
