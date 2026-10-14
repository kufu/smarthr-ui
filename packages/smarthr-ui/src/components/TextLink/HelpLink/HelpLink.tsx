import { type ComponentPropsWithoutRef, type FC, memo } from 'react'

import { FaCircleQuestionIcon } from '../../Icon'
import { TextLink } from '../TextLink'

type Props = Omit<ComponentPropsWithoutRef<typeof TextLink>, 'rel' | 'prefix' | 'suffix'>

// HINT: hrefはrestに含めずここで明示的に分割代入している。TextLinkはgeneric関数コンポーネントのため、
// typeof TextLinkをBaseにしたSHRComponentPropsWithRef内部のkeyof/Omit処理でProps全体の型情報がanyに潰れ、
// restに含めたままではhref必須化の型チェックが機能しない(tscでProperty 'href' is missingが検出できない)
export const HelpLink: FC<Props> = memo(({ href, target, ...rest }) => (
  <TextLink
    {...rest}
    href={href}
    rel="help"
    target={target}
    referrerPolicy="no-referrer-when-downgrade"
    prefix={!target && <FaCircleQuestionIcon />}
  />
))
