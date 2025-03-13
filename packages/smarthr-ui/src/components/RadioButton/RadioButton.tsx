'use client'

import React, {
  type ComponentPropsWithRef,
  type PropsWithChildren,
  forwardRef,
  useId,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { isIOS } from '../../libs/ua'

type Props = PropsWithChildren<ComponentPropsWithRef<'input'>>

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-RadioButton shr-inline-flex shr-items-baseline',
    label: [
      'smarthr-ui-RadioButton-label shr-ms-0.5 shr-text-base shr-leading-tight',
      'shr-cursor-pointer',
      '[[data-disabled="true"]>&]:shr-cursor-[revert] [[data-disabled="true"]>&]:shr-text-disabled',
    ],
    innerWrapper:
      'shr-relative shr-inline-block shr-h-em shr-w-em shr-shrink-0 shr-translate-y-[0.125em] shr-leading-none',
    box: [
      'shr-pointer-events-none',
      'shr-border-shorthand shr-box-border shr-block shr-h-full shr-w-full shr-rounded-full shr-bg-white',
      /* 強制カラーモードのときは、ブラウザ標準のUIを表示する */
      'forced-colors:shr-hidden',
      'contrast-more:shr-border-high-contrast',
      'peer-checked:shr-border-main peer-checked:shr-bg-main contrast-more:peer-checked:shr-border-high-contrast',
      'peer-checked:before:shr-pointer-events-none peer-checked:before:shr-absolute peer-checked:before:shr-left-1/2 peer-checked:before:shr-top-1/2 peer-checked:before:shr-h-[0.375em] peer-checked:before:shr-w-[0.375em] peer-checked:before:-shr-translate-x-1/2 peer-checked:before:-shr-translate-y-1/2 peer-checked:before:shr-rounded-full peer-checked:before:shr-bg-white peer-checked:before:shr-content-[""]',
      'peer-disabled:shr-border-default/50 peer-disabled:shr-bg-white-darken',
      'peer-disabled:peer-checked:shr-border-default peer-disabled:peer-checked:shr-bg-border peer-disabled:peer-checked:before:shr-bg-white-darken',
      'peer-focus-visible:shr-focus-indicator',
      'peer-[:not(:disabled)]:peer-hover:shr-shadow-input-hover',
    ],
    input: [
      'smarthr-ui-RadioButton-radioButton shr-peer',
      'shr-absolute shr-left-0 shr-top-0 shr-m-0 shr-h-full shr-w-full shr-cursor-pointer shr-opacity-0',
      'disabled:shr-pointer-events-none',
      /* 強制カラーモードのときは、ブラウザ標準のUIを表示する */
      'forced-colors:shr-static forced-colors:shr-opacity-100',
    ],
  },
})

export const RadioButton = forwardRef<HTMLInputElement, Props>(
  ({ onChange, children, className, required, ...props }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, innerWrapper, box, input, label } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        innerWrapper: innerWrapper(),
        box: box(),
        input: input(),
        label: label(),
      }
    }, [className])

    const defaultId = useId()
    const radioButtonId = props.id || defaultId

    return (
      <span data-disabled={props.disabled} className={classNames.wrapper}>
        <span className={classNames.innerWrapper}>
          <input
            {...props}
            ref={ref}
            type="radio"
            id={radioButtonId}
            // HINT: required属性を設定すると、iOS端末で以下の問題が発生します
            //  - フォームのsubmit時にバリデーションは行われるが、ユーザーにフィードバックがない
            //    - エラーメッセージが表示されない
            //    - 問題のある入力フィールドまでスクロールしない
            // 歴史的に一部の端末ではrequired属性が無視されることがあるため、HTMLのバリデーションのみとすることは少ないです
            // そのため、iOS端末ではrequired属性を設定しない方がユーザーがsubmitできない理由をエラーメッセージなどで正しく理解できるようになります
            required={isIOS ? undefined : required}
            onChange={onChange}
            className={classNames.input}
            data-smarthr-ui-input="true"
          />
          <AriaHiddenBox className={classNames.box} />
        </span>
        <LabeledChildren htmlFor={radioButtonId} className={classNames.label}>
          {children}
        </LabeledChildren>
      </span>
    )
  },
)

const AriaHiddenBox = React.memo<{ className: string }>(({ className }) => (
  <span className={className} aria-hidden="true" />
))

const LabeledChildren = React.memo<PropsWithChildren<{ htmlFor: string; className: string }>>(
  ({ htmlFor, className, children }) =>
    children && (
      <label htmlFor={htmlFor} className={className}>
        {children}
      </label>
    ),
)
