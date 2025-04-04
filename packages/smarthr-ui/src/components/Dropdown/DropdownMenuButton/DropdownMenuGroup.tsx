import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '../../Text'

import { renderButtonList } from './DropdownMenuButton'

type AbstractProps = PropsWithChildren<{
  name?: ReactNode
}>
type ElementProps = Omit<ComponentProps<'li'>, keyof AbstractProps>
type Props = AbstractProps & ElementProps

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
  },
})

export const DropdownMenuGroup: FC<Props> = ({ name, children, className }) => {
  const classNames = useMemo(() => {
    const { group, groupName } = classNameGenerator()

    return {
      group: group({ className }),
      groupName: groupName(),
    }
  }, [className])

  return (
    <li className={classNames.group}>
      {name ? (
        <dl>
          <NameDefinitionTerm className={classNames.groupName}>{name}</NameDefinitionTerm>
          {renderButtonList(children, 'dd')}
        </dl>
      ) : (
        <ul>{renderButtonList(children)}</ul>
      )}
    </li>
  )
}

const NameDefinitionTerm = memo<PropsWithChildren<{ className: string }>>(
  ({ children, className }) => (
    <Text size="S" weight="bold" color="TEXT_GREY" leading="NONE" className={className} as="dt">
      {children}
    </Text>
  ),
)
