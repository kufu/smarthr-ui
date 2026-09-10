import { type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Drawer-footer',
    'shr-border-t-shorthand shr-flex shr-flex-[0_0_auto] shr-items-center shr-justify-end shr-gap-1 shr-p-1',
  ],
})

export type DrawerFooterProps = PropsWithChildren<{ className?: string }>

export const DrawerFooter: FC<DrawerFooterProps> = ({ className, children }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return <div className={actualClassName}>{children}</div>
}
