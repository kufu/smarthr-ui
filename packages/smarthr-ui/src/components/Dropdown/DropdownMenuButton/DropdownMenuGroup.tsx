import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useId,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../Text'

import { renderButtonList } from './DropdownMenuButton'

type BaseProps = PropsWithChildren<{
  name?: ReactNode
}>
type Props = BaseProps & Omit<ComponentProps<'li'>, keyof BaseProps>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-DropdownMenuGroup',
    '[&:not(:first-child)]:shr-relative',
    '[&:not(:first-child)]:shr-mt-0.5',
    '[&:not(:first-child)]:shr-pt-0.5',
    '[&:not(:first-child)]:shr-min-w-[8em]',
    '[&:not(:first-child)]:before:shr-content-[""]',
    '[&:not(:first-child)]:before:shr-absolute',
    '[&:not(:first-child)]:before:shr-top-0',
    '[&:not(:first-child)]:before:shr-inset-x-1',
    '[&:not(:first-child)]:before:shr-h-px',
    '[&:not(:first-child)]:before:shr-bg-border',
  ],
})

export const DropdownMenuGroup: FC<Props> = ({ name, children, className }) => {
  const subMenuId = useId()
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  const subMenu = (
    <menu role="group" className="shr-list-none" aria-labelledby={name ? subMenuId : undefined}>
      {renderButtonList(children)}
    </menu>
  )

  return (
    <li role="presentation" className={actualClassName}>
      {name ? (
        <>
          <Text
            as="div"
            id={subMenuId}
            size="S"
            weight="bold"
            color="TEXT_GREY"
            leading="NONE"
            className="shr-px-1 shr-py-0.5"
          >
            {name}
          </Text>
          {subMenu}
        </>
      ) : (
        subMenu
      )}
    </li>
  )
}
