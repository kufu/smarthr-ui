import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { Base } from '../Base'
import { Heading } from '../Heading'
import { Nav } from '../SectioningContent'

const classNameGenerator = tv({
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
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Nav>
      <Heading visuallyHidden={true}>
        <Localizer id="smarthr-ui/SideMenu/navigationLabel" defaultText="サイドメニュー" />
      </Heading>
      <Base {...rest} as={elementAs} className={actualClassName} />
    </Nav>
  )
}
