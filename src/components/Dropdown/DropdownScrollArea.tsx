import React, { ComponentProps, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

type Props = PropsWithChildren<ComponentProps<'div'>>

const scrollArea = tv({
  base: 'smarthr-ui-Dropdown-scrollArea shr-flex-auto shr-overflow-y-auto',
})

export const DropdownScrollArea: React.FC<Props> = ({ className, ...props }) => {
  const styles = useMemo(() => scrollArea({ className }), [className])

  return <div {...props} className={styles} />
}
