import React, {
  ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { FaCheckIcon, FaMinusIcon } from '../Icon'

type Props = ComponentPropsWithRef<'input'> & {
  /** `true` のとき、チェック状態を `mixed` にする */
  mixed?: boolean
  /** チェックボックスにエラーがあるかどうか */
  error?: boolean
}

const checkboxInput = tv({
  slots: {
    box: [
      'shr-pointer-events-none shr-absolute shr-box-border shr-h-full shr-w-full shr-rounded-s shr-border shr-border-solid shr-bg-white',
      'contrast-more:shr-border-highContrast',
      /* 強制カラーモードのときは、ブラウザ標準のUIを表示する */
      'forced-colors:shr-hidden',
      'peer-checked:shr-border-main peer-checked:shr-bg-main contrast-more:peer-checked:shr-border-highContrast',
      'peer-indeterminate:shr-border-main peer-indeterminate:shr-bg-main contrast-more:peer-indeterminate:shr-border-highContrast',
      'peer-disabled:shr-border-disabled peer-disabled:shr-bg-white-darken',
      'peer-disabled:peer-checked:shr-border-default peer-disabled:peer-checked:shr-bg-border',
      'peer-disabled:peer-indeterminate:shr-border-default peer-disabled:peer-indeterminate:shr-bg-border',
      'peer-focus-visible:shr-focusIndicator',
      'peer-hover:shr-shadow-input-hover',
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
      'peer-disabled:peer-indeteminate:shr-text-white-darken peer-disabled:peer-checked:shr-text-white-darken',
      'forced-colors:shr-hidden',
    ],
    wrapper:
      'shr-relative shr-box-border shr-inline-block shr-h-[theme(fontSize.base)] shr-w-[theme(fontSize.base)] shr-shrink-0 shr-translate-y-[0.125em] shr-leading-none',
  },
  variants: {
    error: {
      true: {
        box: 'shr-border-danger',
      },
      false: {
        box: 'shr-border-default',
      },
    },
  },
  defaultVariants: {
    error: false,
  },
})

export const CheckBoxInput = forwardRef<HTMLInputElement, Props>(
  ({ checked, mixed = false, error, onChange, ...props }, ref) => {
    const { wrapperStyle, boxStyle, inputStyle, iconWrapStyle, iconStyle } = useMemo(() => {
      const { wrapper, box, input, iconWrap, icon } = checkboxInput()
      return {
        wrapperStyle: wrapper(),
        boxStyle: box({ error }),
        inputStyle: input(),
        iconWrapStyle: iconWrap(),
        iconStyle: icon(),
      }
    }, [error])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
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

    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <input
          {...props}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className={inputStyle}
          ref={inputRef}
          aria-invalid={error || undefined}
        />
        <span className={boxStyle} />
        <span className={iconWrapStyle}>
          {mixed ? <FaMinusIcon className={iconStyle} /> : <FaCheckIcon className={iconStyle} />}
        </span>
      </span>
    )
  },
)
