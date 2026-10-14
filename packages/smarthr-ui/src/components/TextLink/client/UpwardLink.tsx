'use client'

import { type ElementType, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../../hooks/client/useEnvironment'
import { FaArrowLeftIcon } from '../../Icon'
import { TextLink } from '../TextLink'

import type { SHRComponentPropsWithRef } from '../../../types'

const classNameGenerator = tv({
  base: 'shr-leading-none',
  variants: {
    indent: {
      true: '-shr-translate-x-1.25',
      false: '',
    },
  },
})

// HINT: typeof TextLinkをそのままBaseに使うと、TextLinkがgeneric関数コンポーネントであるため
// SHRComponentPropsWithRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、href必須化の型チェックが
// 機能しない。typeof TextLink<'a'>で単相化することでこれを回避する一方、elementAsもこれに伴い'a'固定の
// 型になってしまうため、ここだけ元の緩い型(next/linkなどを想定)で定義し直している
type Props = Omit<
  SHRComponentPropsWithRef<
    typeof TextLink<'a'>,
    {
      /** インデントするかどうか */
      indent?: boolean
    },
    { omit: 'prefix' | 'suffix' }
  >,
  'elementAs'
> & {
  /** TextLinkを利用しつつnext/linkなどと併用する場合に指定する */
  elementAs?: ElementType
}

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
