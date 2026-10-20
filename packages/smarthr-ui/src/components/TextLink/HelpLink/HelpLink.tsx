import { type ComponentPropsWithoutRef, type ElementType, memo } from 'react'

import { FaCircleQuestionIcon } from '../../Icon'
import { TextLink } from '../TextLink'

// HINT: typeof TextLinkをそのままBaseに使うと、TextLinkがgeneric関数コンポーネントであるため
// ComponentPropsWithoutRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、href必須化の型チェックが
// 機能しない。typeof TextLink<T>のようにHelpLink自身のTで具体化することで回避している。
// elementAsはTの奥深く(ComponentPropsWithoutRef<typeof TextLink<T>>)に埋もれていると、JSX呼び出し時に
// elementAsの値からTを逆算できずデフォルト('a')に固定されてしまうため、Tから一度切り離した上で
// elementAs?: Tとして明示的に持たせ、TypeScriptが推論できるようにしている
type Props<T extends ElementType = 'a'> = Omit<
  ComponentPropsWithoutRef<typeof TextLink<T>>,
  'rel' | 'prefix' | 'suffix' | 'elementAs'
> & {
  /** TextLinkを利用しつつnext/linkなどと併用する場合に指定する */
  elementAs?: T
}

const ActualHelpLink = <T extends ElementType = 'a'>({ target, ...rest }: Props<T>) => (
  <TextLink<T>
    // HINT: restの型(Omit由来の複雑な条件型)とTextLink<T>が要求するProps<T>は実体として一致するが、
    // TypeScriptの構造的型チェックでは検証しきれないため、ここでのみ型を合わせている
    {...(rest as Parameters<typeof TextLink<T>>[0])}
    rel="help"
    target={target}
    referrerPolicy="no-referrer-when-downgrade"
    prefix={!target && <FaCircleQuestionIcon />}
  />
)

export const HelpLink = memo(ActualHelpLink) as typeof ActualHelpLink
