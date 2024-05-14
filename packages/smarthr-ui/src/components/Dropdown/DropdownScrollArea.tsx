import React, { ComponentProps, ElementType, PropsWithChildren, forwardRef, useMemo } from 'react'
import { tv } from 'tailwind-variants'

type Props = PropsWithChildren<ComponentProps<'div'>> & {
  as?: ElementType
}

const scrollArea = tv({
  base: 'smarthr-ui-Dropdown-scrollArea shr-flex-auto shr-overflow-y-auto',
})

export const DropdownScrollArea = forwardRef<HTMLDivElement, Props>(
  ({ as: Component = 'div', className, ...props }, ref) => {
    const styles = useMemo(() => scrollArea({ className }), [className])

    return <Component {...props} ref={ref} className={styles} />
  },
)
