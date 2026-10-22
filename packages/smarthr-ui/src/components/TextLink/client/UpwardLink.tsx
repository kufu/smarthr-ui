'use client'

import { type ElementType, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../../hooks/client/useEnvironment'
import { FaArrowLeftIcon } from '../../Icon'
import { TextLink } from '../TextLink'

import type { ExtendElementPropsWithRef } from '../../../types'

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
// ExtendElementPropsWithRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、href必須化の型チェックが
// 機能しない。typeof TextLink<T>のようにUpwardLink自身のTで具体化することで回避している。
// elementAsはTの奥深く(ExtendElementPropsWithRef<typeof TextLink<T>, ...>)に埋もれていると、JSX呼び出し時に
// elementAsの値からTを逆算できずデフォルト('a')に固定されてしまうため、Tから一度切り離した上で
// elementAs?: Tとして明示的に持たせ、TypeScriptが推論できるようにしている
type Props<T extends ElementType = 'a'> = Omit<
  ExtendElementPropsWithRef<
    typeof TextLink<T>,
    {
      /** インデントするかどうか */
      indent?: boolean
    },
    { omit: 'prefix' | 'suffix' }
  >,
  'elementAs'
> & {
  /** TextLinkを利用しつつnext/linkなどと併用する場合に指定する */
  elementAs?: T
}

const ActualUpwardLink = <T extends ElementType = 'a'>({
  indent,
  className,
  ...rest
}: Props<T>) => {
  const { mobile } = useEnvironment()
  const actualClassName = useMemo(
    () => classNameGenerator({ indent: indent ?? !mobile, className }),
    [indent, mobile, className],
  )

  return (
    <div className={actualClassName}>
      {/* HINT: restの型(ExtendElementPropsWithRef由来の複雑な条件型)とTextLink<T>が要求するProps<T>は
      実体として一致するが、TypeScriptの構造的型チェックでは検証しきれないため、ここでのみ型を合わせている */}
      <TextLink<T> {...(rest as Parameters<typeof TextLink<T>>[0])} prefix={<FaArrowLeftIcon />} />
    </div>
  )
}

export const UpwardLink = memo(ActualUpwardLink) as typeof ActualUpwardLink
