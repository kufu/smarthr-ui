'use client'

import { type ComponentPropsWithRef, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../../hooks/client/useEnvironment'
import { FaArrowLeftIcon } from '../../Icon'
import { TextLink } from '../TextLink'

const classNameGenerator = tv({
  base: 'shr-leading-none',
  variants: {
    indent: {
      true: '-shr-translate-x-1.25',
      false: '',
    },
  },
})

type TextLinkProps = ComponentPropsWithRef<typeof TextLink>
type BaseProps = {
  /** インデントするかどうか */
  indent?: boolean
  /** `TextLink`に渡す `elementAs` をオプションで指定 */
  elementAs?: TextLinkProps['elementAs']
}
type Props = BaseProps & Omit<TextLinkProps, keyof BaseProps | 'prefix' | 'suffix'>

export const UpwardLink = memo<Props>(({ indent, className, ...rest }) => {
  const { mobile } = useEnvironment()
  const actualClassName = useMemo(
    () => classNameGenerator({ indent: indent ?? !mobile, className }),
    [indent, mobile, className],
  )

  return (
    <div className={actualClassName}>
      <TextLink {...rest} prefix={<FaArrowLeftIcon />} />
    </div>
  )
})
