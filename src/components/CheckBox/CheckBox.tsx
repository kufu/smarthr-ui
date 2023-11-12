import React, { ComponentProps, PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useId } from '../../hooks/useId'

import { CheckBoxInput } from './CheckBoxInput'

export type Props = PropsWithChildren<{
  // TODO lineHeight 使ってる? 消したい
  /** ラベル部分の `line-height` */
  lineHeight?: number
}> &
  ComponentProps<typeof CheckBoxInput>

const checkbox = tv({
  slots: {
    wrapper: 'smarthr-ui-CheckBox shr-inline-flex shr-items-baseline',
    label: [
      'smarthr-ui-CheckBox-label shr-ms-0.5 shr-cursor-pointer shr-text-base shr-leading-tight shr-text-black',
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
  ({ lineHeight = 1.5, className, children, ...props }, ref) => {
    const { wrapperStyle, labelStyle } = useMemo(() => {
      const { wrapper, label } = checkbox()
      return {
        wrapperStyle: wrapper({ className }),
        labelStyle: label({ disabled: props.disabled }),
      }
    }, [className, props.disabled])

    const checkBoxId = useId(props.id)

    return (
      <span className={wrapperStyle}>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <CheckBoxInput {...props} ref={ref} id={checkBoxId} />

        {children && (
          <label className={labelStyle} htmlFor={checkBoxId}>
            {children}
          </label>
        )}
      </span>
    )
  },
)
