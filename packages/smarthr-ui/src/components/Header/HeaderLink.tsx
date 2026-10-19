import { memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton } from '../Button'

import type { ExtendElementPropsWithRef } from '../../types'

// HINT: typeof AnchorButtonをそのままBaseに使うと、AnchorButtonがgeneric関数コンポーネントであるため
// ExtendElementPropsWithRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、href必須化の型チェックが
// 機能しない。HeaderLinkはelementAsを使用しないため、typeof AnchorButton<'a'>で単相化して回避する
type Props = ExtendElementPropsWithRef<
  typeof AnchorButton<'a'>,
  { enableNew?: boolean },
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

export const HeaderLink = memo<Props>(({ enableNew, className, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ enableNew, className }),
    [enableNew, className],
  )

  return <AnchorButton {...rest} target="_blank" variant="text" className={actualClassName} />
})
