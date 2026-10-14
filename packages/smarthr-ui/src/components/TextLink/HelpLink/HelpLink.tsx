import { type ComponentPropsWithoutRef, type ElementType, type FC, memo } from 'react'

import { FaCircleQuestionIcon } from '../../Icon'
import { TextLink } from '../TextLink'

// HINT: typeof TextLinkをそのままBaseに使うと、TextLinkがgeneric関数コンポーネントであるため
// ComponentPropsWithoutRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、href必須化の型チェックが
// 機能しない。typeof TextLink<'a'>で単相化することでこれを回避する一方、elementAsもこれに伴い'a'固定の
// 型になってしまうため、ここだけ元の緩い型(next/linkなどを想定)で定義し直している
type Props = Omit<
  ComponentPropsWithoutRef<typeof TextLink<'a'>>,
  'rel' | 'prefix' | 'suffix' | 'elementAs'
> & {
  /** TextLinkを利用しつつnext/linkなどと併用する場合に指定する */
  elementAs?: ElementType
}

export const HelpLink: FC<Props> = memo(({ target, ...rest }) => (
  <TextLink
    {...rest}
    rel="help"
    target={target}
    referrerPolicy="no-referrer-when-downgrade"
    prefix={!target && <FaCircleQuestionIcon />}
  />
))
