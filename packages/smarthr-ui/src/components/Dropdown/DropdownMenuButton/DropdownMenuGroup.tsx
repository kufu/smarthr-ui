import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useId,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../Text'

import { renderButtonList } from './DropdownMenuButton'

type AbstractProps = PropsWithChildren<{
  name?: ReactNode
}>
type Props = AbstractProps & Omit<ComponentProps<'li'>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    group: [
      'smarthr-ui-DropdownMenuGroup',
      [
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
    ],
    groupName: 'shr-px-1 shr-py-0.5',
    subMenu: 'shr-list-none',
  },
})

export const DropdownMenuGroup: FC<Props> = ({ name, children, className }) => {
  const subMenuId = useId()
  const classNames = useMemo(() => {
    const { group, groupName, subMenu } = classNameGenerator()

    return {
      group: group({ className }),
      groupName: groupName(),
      subMenu: subMenu(),
    }
  }, [className])

  const subMenu = (
    <menu
      role="group"
      aria-labelledby={name ? subMenuId : undefined}
      className={classNames.subMenu}
    >
      {renderButtonList(children)}
    </menu>
  )

  return (
    <li role="presentation" className={classNames.group}>
      {name ? (
        <>
          <NameText id={subMenuId} className={classNames.groupName}>
            {name}
          </NameText>
          {subMenu}
        </>
      ) : (
        subMenu
      )}
    </li>
  )
}

const NameText = memo<PropsWithChildren<{ id: string; className: string }>>(
  ({ id, children, className }) => (
    <Text
      size="S"
      id={id}
      weight="bold"
      color="TEXT_GREY"
      leading="NONE"
      className={className}
      as="div"
    >
      {children}
    </Text>
  ),
)
