'use client'

// HINT: libs/uaはtypeof window !== 'undefined'でガードされているためRSCで例外にはならないが、
// isIOS・isMobileSafariは実機のUAをブラウザ側で検出する必要がある。Server Componentのままだと
// navigatorが存在しないサーバ上で1回だけ評価され常にfalseに固定されるため、'use client'が必要

import { isIOS } from '../../../libs/ua'

import type { ComponentPropsWithRef, FC, PropsWithChildren, Ref } from 'react'

type Props = PropsWithChildren<
  {
    outerRef: Ref<HTMLInputElement>
  } & ComponentPropsWithRef<'input'>
>

export const ActualRadioButton: FC<Props> = ({ outerRef, required, ...rest }) => (
  <input
    {...rest}
    ref={outerRef}
    type="radio"
    // HINT: required属性を設定すると、iOS端末で以下の問題が発生します
    //  - フォームのsubmit時にバリデーションは行われるが、ユーザーにフィードバックがない
    //    - エラーメッセージが表示されない
    //    - 問題のある入力フィールドまでスクロールしない
    // 歴史的に一部の端末ではrequired属性が無視されることがあるため、HTMLのバリデーションのみとすることは少ないです
    // そのため、iOS端末ではrequired属性を設定しない方がユーザーがsubmitできない理由をエラーメッセージなどで正しく理解できるようになります
    required={isIOS ? undefined : required}
    data-smarthr-ui-input="true"
  />
)
