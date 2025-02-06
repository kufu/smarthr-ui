'use client'

import React, {
  ComponentPropsWithRef,
  PropsWithChildren,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { FaCheckIcon, FaMinusIcon } from '../Icon'

export type Props = PropsWithChildren<
  ComponentPropsWithRef<'input'> & {
    /** `true` のとき、チェック状態を `mixed` にする */
    mixed?: boolean
    /** チェックボックスにエラーがあるかどうか */
    error?: boolean
  }
>

const checkbox = tv({
  slots: {
    wrapper: 'smarthr-ui-CheckBox shr-inline-flex shr-items-baseline',
    box: [
      'shr-border-shorthand shr-pointer-events-none shr-absolute shr-box-border shr-h-full shr-w-full shr-rounded-s shr-bg-white',
      'contrast-more:shr-border-high-contrast',
      /* 強制カラーモードのときは、ブラウザ標準のUIを表示する */
      'forced-colors:shr-hidden',
      'peer-checked:shr-border-main peer-checked:shr-bg-main contrast-more:peer-checked:shr-border-high-contrast',
      'peer-indeterminate:shr-border-main peer-indeterminate:shr-bg-main contrast-more:peer-indeterminate:shr-border-high-contrast',
      'peer-disabled:shr-border-disabled peer-disabled:shr-bg-white-darken',
      'peer-disabled:peer-checked:shr-border-default peer-disabled:peer-checked:shr-bg-border',
      'peer-disabled:peer-indeterminate:shr-border-default peer-disabled:peer-indeterminate:shr-bg-border',
      'peer-focus-visible:shr-focus-indicator',
      'peer-hover:shr-shadow-input-hover',
      'shr-border-default',
      'peer-[[aria-invalid]]:shr-border-danger',
    ],
    input: [
      'smarthr-ui-CheckBox-checkBox shr-peer shr-absolute shr-left-0 shr-top-0 shr-m-0 shr-h-full shr-w-full shr-cursor-pointer shr-opacity-0 disabled:shr-pointer-events-none',
      /* 強制カラーモードのときは、ブラウザ標準のUIを表示する */
      'forced-colors:shr-static forced-colors:shr-opacity-100',
    ],
    icon: 'shr-fill-current',
    iconWrap: [
      'shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-1/2 shr-inline-block shr-h-[theme(fontSize.2xs)] shr-w-[theme(fontSize.2xs)] -shr-translate-x-1/2 -shr-translate-y-1/2 shr-text-2xs',
      'shr-text-transparent peer-checked:shr-text-white peer-indeterminate:shr-text-white',
      'peer-disabled:peer-indeterminate:shr-text-white-darken peer-disabled:peer-checked:shr-text-white-darken',
      'forced-colors:shr-hidden',
    ],
    innerWrapper:
      'shr-relative shr-box-border shr-inline-block shr-h-[theme(fontSize.base)] shr-w-[theme(fontSize.base)] shr-shrink-0 shr-translate-y-[0.125em] shr-leading-none',
    label: [
      'smarthr-ui-CheckBox-label shr-ms-0.5 shr-cursor-pointer shr-text-base shr-leading-tight',
      '[[data-disabled=true]>&]:shr-pointer-events-none [[data-disabled=true]>&]:shr-cursor-not-allowed [[data-disabled=true]>&]:shr-text-disabled',
    ],
  },
})

export const CheckBox = forwardRef<HTMLInputElement, Props>(
  ({ checked, mixed, error, className, children, disabled, ...props }, ref) => {
    const classNames = useMemo(() => {
      const { wrapper, innerWrapper, box, input, iconWrap, icon, label } = checkbox()

      return {
        wrapper: wrapper({ className }),
        innerWrapper: innerWrapper(),
        box: box(),
        input: input(),
        iconWrap: iconWrap(),
        icon: icon(),
        label: label(),
      }
    }, [className])

    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => inputRef.current,
    )

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!(checked && mixed)
      }
    }, [checked, mixed])

    const defaultId = useId()
    const checkBoxId = props.id || defaultId

    return (
      <span data-disabled={disabled?.toString()} className={classNames.wrapper}>
        <span className={classNames.innerWrapper}>
          <input
            {...props}
            ref={inputRef}
            type="checkbox"
            id={checkBoxId}
            checked={checked}
            disabled={disabled}
            aria-invalid={error || undefined}
            className={classNames.input}
            data-smarthr-ui-input="true"
          />
          <AriaHiddenBox className={classNames.box} />
          <CheckIconArea
            mixed={mixed}
            className={classNames.iconWrap}
            iconStyle={classNames.icon}
          />
        </span>

        <LabeledChildren htmlFor={checkBoxId} className={classNames.label}>
          {children}
        </LabeledChildren>
      </span>
    )
  },
)

const AriaHiddenBox = React.memo<{ className: string }>(({ className }) => (
  <span className={className} aria-hidden="true" />
))

const CheckIconArea = React.memo<Pick<Props, 'mixed'> & { className: string; iconStyle: string }>(
  ({ mixed, className, iconStyle }) => (
    <span className={className}>
      {mixed ? <FaMinusIcon className={iconStyle} /> : <FaCheckIcon className={iconStyle} />}
    </span>
  ),
)

const LabeledChildren = React.memo<PropsWithChildren<{ className: string; htmlFor: string }>>(
  ({ children, htmlFor, className }) =>
    children && (
      <label htmlFor={htmlFor} className={className}>
        {children}
      </label>
    ),
)
