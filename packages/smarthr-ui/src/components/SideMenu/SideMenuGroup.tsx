import {
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { Section } from '../SectioningContent'

type AbstractProps = PropsWithChildren<{
  heading: ReactNode
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'li'>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-SideMenu-group', '[&:not(:first-of-type)]:shr-mt-1'],
    list: 'shr-list-none',
    groupHeading: 'shr-px-1 shr-py-0.5 shr-text-sm',
  },
})

export const SideMenuGroup = ({
  heading,
  children,
  className,
  ...rest
}: AbstractProps & ElementProps) => {
  const classNames = useMemo(() => {
    const { wrapper, list, groupHeading } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      list: list(),
      groupHeading: groupHeading(),
    }
  }, [className])

  return (
    <li {...rest} className={classNames.wrapper}>
      <Section>
        <GroupHeading className={classNames.groupHeading}>{heading}</GroupHeading>
        <ul className={classNames.list}>{children}</ul>
      </Section>
    </li>
  )
}

const GroupHeading = memo<PropsWithChildren<{ className: string }>>(({ children, className }) => (
  <Heading type="subBlockTitle" className={className}>
    {children}
  </Heading>
))
