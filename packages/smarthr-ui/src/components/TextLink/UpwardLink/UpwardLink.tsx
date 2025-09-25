import { type ComponentProps, memo, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { TextLink } from '..'
import { FaArrowLeftIcon } from '../../Icon'

const classNameGenerator = tv({
  base: 'shr-leading-none',
  variants: {
    indent: {
      true: '-shr-translate-x-1.25',
      false: '',
    },
  },
})

type Props = Omit<ComponentProps<typeof TextLink>, 'prefix' | 'suffix'> &
  VariantProps<typeof classNameGenerator> & {
    /** `TextLink`に渡す `elementAs` をオプションで指定 */
    elementAs?: ComponentProps<typeof TextLink>['elementAs']
  }

export const UpwardLink = memo<Props>(({ indent, className, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ indent: indent ?? true, className }),
    [indent, className],
  )

  return (
    <div className={actualClassName}>
      <TextLink {...rest} prefix={<FaArrowLeftIcon aria-hidden={true} />} />
    </div>
  )
})
