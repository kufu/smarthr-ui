'use client'

import { type ComponentPropsWithRef, type ReactNode, forwardRef, useId } from 'react'
import { tv } from 'tailwind-variants'

import { UnlabeledCheckbox } from './UnlabeledCheckbox'

export type Props = ComponentPropsWithRef<'input'> & {
  children: ReactNode
  /** `true` のとき、チェック状態を `mixed` にする */
  mixed?: boolean
  /** チェックボックスにエラーがあるかどうか */
  error?: boolean
}

const classNameGenerator = tv({
  slots: {
    label: [
      'smarthr-ui-Checkbox-label shr-ms-0.5 shr-cursor-pointer shr-text-base shr-leading-tight',
      '[[data-disabled=true]>&]:shr-pointer-events-none [[data-disabled=true]>&]:shr-cursor-not-allowed [[data-disabled=true]>&]:shr-text-disabled',
    ],
  },
})

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ checked, mixed, error, className, children, disabled, ...props }, ref) => {
    const { label } = classNameGenerator()

    const defaultId = useId()
    const checkboxId = props.id || defaultId

    return (
      <UnlabeledCheckbox
        {...props}
        id={checkboxId}
        ref={ref}
        checked={checked}
        mixed={mixed}
        error={error}
        className={className}
        disabled={disabled}
      >
        <label htmlFor={checkboxId} className={label()}>
          {children}
        </label>
      </UnlabeledCheckbox>
    )
  },
)
