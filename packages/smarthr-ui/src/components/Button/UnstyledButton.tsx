import React, { ComponentProps, PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

const unstyledButton = tv({
  base: [
    'shr-box-content shr-inline shr-cursor-pointer shr-select-auto shr-appearance-none shr-items-stretch shr-overflow-visible shr-border-none shr-border-current shr-bg-transparent shr-bg-none shr-bg-origin-padding shr-p-0 shr-text-left shr-font-inherit shr-text-inherit shr-text-color-inherit',
    'focus-visible:shr-focus-indicator',
  ],
})

export const UnstyledButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ComponentProps<'button'>>
>(({ className, type = 'button', ...props }, ref) => {
  const styles = useMemo(() => unstyledButton({ className }), [className])
  return <button {...props} type={type} ref={ref} className={styles} />
})
