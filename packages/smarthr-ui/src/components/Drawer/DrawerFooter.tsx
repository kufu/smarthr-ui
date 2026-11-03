import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import type { ExtendElementPropsWithRef } from '../../types'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Drawer-footer',
    'shr-border-t-shorthand shr-flex shr-flex-[0_0_auto] shr-items-center shr-justify-end shr-gap-1 shr-p-1',
  ],
})

type Props = ExtendElementPropsWithRef<'div', object>

export const DrawerFooter: FC<Props> = ({ className, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return <div {...rest} className={actualClassName} />
}
