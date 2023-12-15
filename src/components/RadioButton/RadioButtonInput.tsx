import React, { ChangeEvent, ComponentPropsWithRef, forwardRef, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

type Props = ComponentPropsWithRef<'input'>

const radioButtonInput = tv({
  slots: {
    wrapper:
      'shr-relative shr-inline-block shr-h-em shr-w-em shr-shrink-0 shr-translate-y-[0.125em] shr-leading-none',
    box: [
      'shr-pointer-events-none',
      'shr-box-border shr-block shr-h-full shr-w-full shr-rounded-full shr-border shr-border-solid shr-border-default shr-bg-white',
      /* 強制カラーモードのときは、ブラウザ標準のUIを表示する */
      'forced-colors:shr-hidden',
      'contrast-more:shr-border-high-contrast',
      'peer-checked:shr-border-main peer-checked:shr-bg-main contrast-more:peer-checked:shr-border-high-contrast',
      'peer-checked:before:shr-pointer-events-none peer-checked:before:shr-absolute peer-checked:before:shr-left-1/2 peer-checked:before:shr-top-1/2 peer-checked:before:shr-h-[0.375em] peer-checked:before:shr-w-[0.375em] peer-checked:before:-shr-translate-x-1/2 peer-checked:before:-shr-translate-y-1/2 peer-checked:before:shr-rounded-full peer-checked:before:shr-bg-white peer-checked:before:shr-content-[""]',
      'peer-disabled:shr-cursor-not-allowed peer-disabled:shr-border-default/50 peer-disabled:shr-bg-white-darken',
      'peer-disabled:peer-checked:shr-border-default peer-disabled:peer-checked:shr-bg-border peer-disabled:peer-checked:before:shr-bg-white-darken',
      'peer-focus-visible:shr-focus-indicator',
    ],
    input: [
      'smarthr-ui-RadioButton-radioButton shr-peer shr-absolute shr-left-0 shr-top-0 shr-m-0 shr-h-full shr-w-full shr-cursor-pointer shr-opacity-0',
      'disabled:shr-pointer-events-none',
      /* 強制カラーモードのときは、ブラウザ標準のUIを表示する */
      'forced-colors:shr-static forced-colors:shr-opacity-100',
    ],
  },
  variants: {
    disabled: {
      false: {
        box: 'peer-hover:shr-shadow-input-hover',
      },
    },
  },
})

export const RadioButtonInput = forwardRef<HTMLInputElement, Props>(
  ({ onChange, ...props }, ref) => {
    const { wrapperStyle, boxStyle, inputStyle } = useMemo(() => {
      const { wrapper, box, input } = radioButtonInput()
      return {
        wrapperStyle: wrapper(),
        boxStyle: box({ disabled: !!props.disabled }),
        inputStyle: input(),
      }
    }, [props.disabled])

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e)
      },
      [onChange],
    )

    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <input {...props} type="radio" onChange={handleChange} className={inputStyle} ref={ref} />
        <span className={boxStyle} />
      </span>
    )
  },
)
