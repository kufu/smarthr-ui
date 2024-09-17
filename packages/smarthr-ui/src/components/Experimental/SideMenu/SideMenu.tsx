import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Base } from '../../Base'

const sideMenu = tv({
  base: 'smarthr-ui-SideMenu shr-list-none shr-py-0.5',
})

type Props = PropsWithChildren<
  Pick<ComponentPropsWithoutRef<typeof Base>, 'radius' | 'layer' | 'className'>
> & {
  /**
   * @default ul
   */
  elementAs?: 'ul' | 'ol'
}

export const SideMenu: FC<Props> = ({ elementAs = 'ul', className, ...rest }) => {
  const styles = useMemo(() => sideMenu({ className }), [className])
  return <Base {...rest} as={elementAs} className={styles} />
}
