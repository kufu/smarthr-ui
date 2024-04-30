import React, { InputHTMLAttributes, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaCheckIcon } from '../Icon'

const switchStyle = tv({
  slots: {
    wrapper: [
      // Switch 本体
      'shr-border-shorthand shr-relative shr-inline-flex shr-w-[calc(theme(fontSize.base)*2)] shr-items-center shr-rounded-full shr-bg-white',
      // 理想的には padding: 2px; だが、box-shadow を outline で使用しているため、border と padding で2pxの疑似余白を作っている。
      'shr-p-px',
      // :focus-visible-within の代替
      'has-[:focus-visible]:shr-focus-indicator',
      'has-[:checked]:shr-border-[theme(colors.main)] has-[:checked]:shr-bg-main',
      'has-[:disabled]:shr-border-[theme(borderColor.default)] has-[:disabled]:shr-bg-border',
      'forced-colors:has-[:disabled]:shr-border-[GrayText]',
      'supports-[not_selector(:has(+_*))]:shr-border-[revert] supports-[not_selector(:has(+_*))]:shr-bg-[revert]',

      // Switch ツマミ
      'before:shr-box-border before:shr-inline-block before:shr-size-[theme(fontSize.base)] before:shr-scale-[calc(2/3)] before:shr-rounded-full before:shr-border before:shr-border-solid before:shr-border-[theme(colors.grey.30)] before:shr-bg-[theme(colors.grey.30)] before:shr-transition-[transform,margin] before:shr-duration-150 before:shr-ease-out before:shr-content-[""]',
      'has-[:checked]:before:shr-border-shorthand has-[:checked]:before:shr-ms-[theme(fontSize.base)] has-[:checked]:before:shr-scale-100 has-[:checked]:before:shr-bg-white',
      'forced-colors:has-[input:not(:disabled)]:before:shr-bg-[ButtonBorder]',
      'forced-colors:has-[:disabled:not(:checked)]:before:shr-border-solid forced-colors:has-[:disabled:not(:checked)]:before:shr-border-[GrayText]',
      'forced-colors:has-[:disabled:checked]:before:shr-border-[GrayText]',
      'supports-[not_selector(:has(+_*))]:before:hidden',
    ],
    input: [
      'shr-absolute shr-inset-0 shr-m-0 shr-h-full shr-w-full shr-cursor-pointer shr-appearance-none shr-rounded-full shr-opacity-0',
      'disabled:shr-cursor-[revert]',
      'supports-[not_selector(:has(+_*))]:shr-static supports-[not_selector(:has(+_*))]:shr-appearance-auto supports-[not_selector(:has(+_*))]:shr-opacity-100 supports-[not_selector(:has(+_*))]:shr-outline-[revert]',
    ],
    iconWrapper: [
      'shr-pointer-events-none shr-absolute shr-hidden shr-size-[theme(fontSize.base)] shr-items-center shr-justify-center',
      '[:checked~&]:shr-flex',
    ],
    icon: [
      '[:checked~*>&]:shr-fill-white',
      'forced-colors:[:checked~*>&]:shr-fill-[ButtonText]',
      'forced-colors:[:disabled~*>&]:shr-fill-[GrayText]',
    ],
  },
})

type Props = InputHTMLAttributes<HTMLInputElement>

export const NewSwitch = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => {
  const { wrapper, input, icon, iconWrapper } = useMemo(() => switchStyle(), [])
  return (
    <span className={wrapper({ className })}>
      {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
      <input {...props} type="checkbox" role="switch" className={input()} ref={ref} />
      <span className={iconWrapper()}>
        <FaCheckIcon className={icon()} size="XXS" />
      </span>
    </span>
  )
})
