import { type ComponentPropsWithRef, type ElementType, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton } from '../Button'

import type { ExtendProps } from '../../types'

// HINT: typeof AnchorButtonをそのままBaseに使うと、AnchorButtonがgeneric関数コンポーネントであるため
// ExtendElementPropsWithRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、href必須化の型チェックが
// 機能しない。typeof AnchorButton<T>のようにHeaderLink自身のTで具体化することで回避している。
// ただしelementAsはTの奥深く(ComponentPropsWithRef<typeof AnchorButton<T>>)に埋もれていると、
// JSX呼び出し時にelementAsの値からTを逆算できずデフォルト('a')に固定されてしまうため、
// Override側にelementAs?: Tを明示的に持たせてTypeScriptが推論できるようにしている
type Props<T extends ElementType = 'a'> = ExtendProps<
  ComponentPropsWithRef<typeof AnchorButton<T>>,
  { enableNew?: boolean; elementAs?: T },
  { omit: 'variant' | 'size' | 'wide' | 'loading' | 'inactiveReason' | 'target' }
>

const classNameGenerator = tv({
  base: [
    'shr-inline-flex shr-items-center',
    'shr-text-white',
    '[&&]:shr-px-0.25 [&&]:shr-font-normal',
    '[&&]:hover:shr-border-transparent [&&]:hover:shr-bg-transparent',
    '[&&]:focus-visible:shr-border-transparent [&&]:focus-visible:shr-bg-transparent',
    '[&_.smarthr-ui-Icon]:shr-block',
  ],
  variants: {
    enableNew: {
      true: ['[&&]:shr-px-0.5', 'shr-text-black'],
      false: 'hover:shr-text-white',
    },
  },
})

const ActualHeaderLink = <T extends ElementType = 'a'>({
  enableNew,
  className,
  ...rest
}: Props<T>) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ enableNew, className }),
    [enableNew, className],
  )

  return (
    // HINT: restの型(ExtendProps由来の複雑な条件型)とAnchorButton<T>が要求するProps<T>は実体として
    // 一致するが、TypeScriptの構造的型チェックでは検証しきれないため、ここでのみ型を合わせている
    <AnchorButton<T>
      {...(rest as Parameters<typeof AnchorButton<T>>[0])}
      target="_blank"
      variant="text"
      className={actualClassName}
    />
  )
}

export const HeaderLink = memo(ActualHeaderLink) as typeof ActualHeaderLink
