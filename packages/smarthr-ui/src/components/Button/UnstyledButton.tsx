import {
  type ComponentProps,
  type PropsWithChildren,
  type SyntheticEvent,
  forwardRef,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

const EVENT_CANCELLER = (e: SyntheticEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const classNameGenerator = tv({
  base: [
    'shr-box-content shr-inline shr-cursor-pointer shr-select-auto shr-appearance-none shr-items-stretch shr-overflow-visible shr-border-none shr-border-current shr-bg-transparent shr-bg-none shr-bg-origin-padding shr-p-0 shr-text-left shr-font-inherit shr-text-inherit shr-text-color-inherit',
    'focus-visible:shr-focus-indicator',
    'aria-disabled:forced-colors:shr-text-[GrayText] [&_.smarthr-ui-Icon]:forced-colors:aria-disabled:shr-fill-[GrayText]',
  ],
})

export const UnstyledButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ComponentProps<'button'>>
>(({ type = 'button', disabled, onClick, onKeyDown, className, ...rest }, ref) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={actualClassName}
      aria-disabled={disabled || undefined}
      onClick={disabled ? EVENT_CANCELLER : onClick}
      onKeyDown={disabled ? EVENT_CANCELLER : onKeyDown}
    />
  )
})
