import { type ComponentPropsWithoutRef, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Nav } from '../SectioningContent'

type Props = Pick<
  ComponentPropsWithoutRef<typeof Panel>,
  'radius' | 'layer' | 'className' | 'children'
> & {
  /**
   * @default ul
   */
  elementAs?: 'ul' | 'ol'
}

const classNameGenerator = tv({
  base: 'smarthr-ui-SideMenu shr-list-none shr-py-0.5',
})

export const SideMenu: FC<Props> = ({ elementAs = 'ul', className, children, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Nav>
      <Heading visuallyHidden={true}>
        <Localizer id="smarthr-ui/SideMenu/navigationLabel" defaultText="サイドメニュー" />
      </Heading>
      <Panel {...rest} as={elementAs} className={actualClassName}>
        {children}
      </Panel>
    </Nav>
  )
}
