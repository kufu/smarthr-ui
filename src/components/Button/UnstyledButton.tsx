import React, { ComponentProps, PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

const unstyledButton = tv({
  base: [
    'shr-appearance-none',
    'shr-inline',
    'shr-items-stretch',
    'shr-overflow-visible',
    'shr-cursor-auto',
    'shr-p-0',
    'shr-border-none',
    'shr-border-current',
    'shr-box-content',
    'shr-bg-transparent',
    'shr-bg-none',
    'shr-bg-origin-padding',
    'shr-font-inherit',
    'shr-text-inherit',
    'shr-text-left',
    'shr-select-auto',
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
