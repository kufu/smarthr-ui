import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'
import { Heading } from '../Heading'
import { Panel } from '../Panel'
import { Nav } from '../SectioningContent'

type BaseProps = PropsWithChildren<{
  /**
   * @default ul
   */
  elementAs?: 'ul' | 'ol'
}>
type Props = BaseProps &
  Omit<
    Pick<ComponentPropsWithoutRef<typeof Panel>, 'radius' | 'layer' | 'className'>,
    keyof BaseProps
  >

const classNameGenerator = tv({
  base: 'smarthr-ui-SideMenu shr-list-none shr-py-0.5',
})

export const SideMenu: FC<Props> = ({ elementAs = 'ul', className, ...rest }) => {
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <Nav>
      <Heading visuallyHidden={true}>
        <Localizer id="smarthr-ui/SideMenu/navigationLabel" defaultText="サイドメニュー" />
      </Heading>
      <Panel {...rest} as={elementAs} className={actualClassName} />
    </Nav>
  )
}
