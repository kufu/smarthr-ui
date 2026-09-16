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
import { ButtonList } from '../client'

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

// HINT: ButtonList側がDropdownMenuGroup本体をimportせずに判定できるようにするマーカー。
// 循環依存を避けるため、コンポーネント参照ではなくこのプロパティの有無で判定する。
// DropdownMenuButtonがServer Componentから利用され、その子としてDropdownMenuGroupが渡された
// 場合、レンダー結果のli要素として届く（item.typeが関数ではなく'li'になる）ため、この関数
// マーカーでは判定できない。この場合に備え、ルート要素にもdata-smarthr-ui-dropdown-menu-group
// 属性を付与している（ButtonList.tsx側で判定に使用）
type DropdownMenuGroupComponent = FC<Props> & { __isSmarthrUIDropdownMenuGroup: true }

export const DropdownMenuGroup = (({ name, children, className }) => {
  const subMenuId = useId()
  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  const subMenu = (
    <menu role="group" className="shr-list-none" aria-labelledby={name ? subMenuId : undefined}>
      <ButtonList>{children}</ButtonList>
    </menu>
  )

  return (
    <li role="presentation" className={actualClassName} data-smarthr-ui-dropdown-menu-group>
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
}) as DropdownMenuGroupComponent

DropdownMenuGroup.__isSmarthrUIDropdownMenuGroup = true
