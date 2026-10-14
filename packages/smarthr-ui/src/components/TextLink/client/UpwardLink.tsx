'use client'

import { memo, useMemo } from 'react'
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

type Props = SHRComponentPropsWithRef<
  typeof TextLink,
  {
    /** インデントするかどうか */
    indent?: boolean
  },
  { omit: 'prefix' | 'suffix' }
>

// HINT: hrefはrestに含めずここで明示的に分割代入している。TextLinkはgeneric関数コンポーネントのため、
// typeof TextLinkをBaseにしたSHRComponentPropsWithRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、
// restに含めたままではhref必須化の型チェックが機能しない(tscでProperty 'href' is missingが検出できない)
export const UpwardLink = memo<Props>(({ indent, className, href, ...rest }) => {
  const { mobile } = useEnvironment()
  const actualClassName = useMemo(
    () => classNameGenerator({ indent: indent ?? !mobile, className }),
    [indent, mobile, className],
  )

  return (
    <div className={actualClassName}>
      <TextLink {...rest} href={href} prefix={<FaArrowLeftIcon />} />
    </div>
  )
})
