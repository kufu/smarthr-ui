'use client'

import React, {
  ChangeEventHandler,
  ComponentPropsWithRef,
  PropsWithChildren,
  forwardRef,
  useCallback,
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
    ],
  },
  variants: {
    disabled: {
      true: {
        label: 'shr-pointer-events-none shr-cursor-not-allowed shr-text-disabled',
      },
    },
  },
})

export const CheckBox = forwardRef<HTMLInputElement, Props>(
  ({ checked, mixed = false, error, onChange, className, children, ...props }, ref) => {
    const {
      wrapperStyle,
      innerWrapperStyle,
      boxStyle,
      inputStyle,
      iconWrapStyle,
      iconStyle,
      labelStyle,
    } = useMemo(() => {
      const { wrapper, innerWrapper, box, input, iconWrap, icon, label } = checkbox()
      return {
        wrapperStyle: wrapper({ className }),
        innerWrapperStyle: innerWrapper(),
        boxStyle: box(),
        inputStyle: input(),
        iconWrapStyle: iconWrap(),
        iconStyle: icon(),
        labelStyle: label({ disabled: props.disabled }),
      }
    }, [className, props.disabled])

    const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
      (e) => {
        if (onChange) onChange(e)
      },
      [onChange],
    )

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
      <span className={wrapperStyle}>
        <span className={innerWrapperStyle}>
          <input
            {...props}
            data-smarthr-ui-input="true"
            type="checkbox"
            id={checkBoxId}
            checked={checked}
            onChange={handleChange}
            className={inputStyle}
            ref={inputRef}
            aria-invalid={error || undefined}
          />
          <span className={boxStyle} aria-hidden="true" />
          <span className={iconWrapStyle}>
            {mixed ? <FaMinusIcon className={iconStyle} /> : <FaCheckIcon className={iconStyle} />}
          </span>
        </span>

        {children && (
          <label className={labelStyle} htmlFor={checkBoxId}>
            {children}
          </label>
        )}
      </span>
    )
  },
)
