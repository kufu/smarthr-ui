'use client'

// HINT: libs/uaはtypeof window !== 'undefined'でガードされているためRSCで例外にはならないが、
// isIOS・isMobileSafariは実機のUAをブラウザ側で検出する必要がある。Server Componentのままだと
// navigatorが存在しないサーバ上で1回だけ評価され常にfalseに固定されるため、'use client'が必要

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type OptgroupHTMLAttributes,
  type OptionHTMLAttributes,
  type PropsWithChildren,
  type Ref,
  memo,
} from 'react'

import { isIOS, isMobileSafari } from '../../../libs/ua'

type Option<T extends string> = {
  value: T
} & Omit<OptionHTMLAttributes<HTMLOptionElement>, 'value'>
type Optgroup<T extends string> = {
  label: string
  options: Array<Option<T>>
} & OptgroupHTMLAttributes<HTMLOptGroupElement>

type BaseProps<T extends string> = PropsWithChildren<{
  outerRef?: Ref<HTMLSelectElement>
  /** 選択肢のデータの配列 */
  options: Array<Option<T> | Optgroup<T>>
  /** フォームの値が変わったときに発火するコールバック関数 */
  onChangeValue?: (value: T) => void
  /** フォームの値にエラーがあるかどうか */
  error?: boolean
}>

export type Props<T extends string> = BaseProps<T> &
  Omit<ComponentPropsWithoutRef<'select'>, keyof BaseProps<string> | 'children' | 'size'>

export const ActualSelect = <T extends string>({
  outerRef,
  options,
  onChange,
  onChangeValue,
  error,
  required,
  children,
  ...rest
}: Props<T>) => (
  <select
    {...rest}
    ref={outerRef}
    // HINT: required属性を設定すると、iOS端末で以下の問題が発生します
    //  - フォームのsubmit時にバリデーションは行われるが、ユーザーにフィードバックがない
    //    - エラーメッセージが表示されない
    //    - 問題のある入力フィールドまでスクロールしない
    // 歴史的に一部の端末ではrequired属性が無視されることがあるため、HTMLのバリデーションのみとすることは少ないです
    // そのため、iOS端末ではrequired属性を設定しない方がユーザーがsubmitできない理由をエラーメッセージなどで正しく理解できるようになります
    required={isIOS ? undefined : required}
    aria-invalid={error || undefined}
    data-smarthr-ui-input="true"
    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e)

      if (onChangeValue) {
        const selectedOption = options
          .flatMap((option) => ('value' in option ? [option] : option.options))
          .find((option) => option.value === e.target.value)

        if (selectedOption) {
          onChangeValue(selectedOption.value)
        }
      }
    }}
  >
    {children}
  </select>
)

// Support for not omitting labels in Mobile Safari
export const NotOmittingLabelsInMobileSafari = memo<{ className: string }>(
  ({ className }) => isMobileSafari && <optgroup className={className} />,
)
