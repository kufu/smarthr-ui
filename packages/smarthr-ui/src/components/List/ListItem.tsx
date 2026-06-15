import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { FaChevronRightIcon } from '../Icon'
import { Sidebar, Stack } from '../Layout'
import { SectioningFragment } from '../SectioningContent'
import { Text } from '../Text'

import { ListDividerContext } from './List'

type ListItemPadding = 0 | 0.025 | 0.5 | 1 | 1.5

type ListItemPaddingModifier =
  | ListItemPadding
  | {
      block?: ListItemPadding
      inline?: ListItemPadding
    }
  | {
      block?: {
        start?: ListItemPadding
        end?: ListItemPadding
      }
      inline?: {
        start?: ListItemPadding
        end?: ListItemPadding
      }
    }

type Padding = {
  paddingBlockStart: ListItemPadding
  paddingBlockEnd: ListItemPadding
  paddingInlineStart: ListItemPadding
  paddingInlineEnd: ListItemPadding
}

const defaultPadding: Padding = {
  paddingBlockStart: 1,
  paddingBlockEnd: 1,
  paddingInlineStart: 1,
  paddingInlineEnd: 1,
} as const

const mapPaddingModifierToPadding = (paddingModifier: ListItemPaddingModifier): Padding => {
  if (paddingModifier === undefined) {
    return defaultPadding
  }
  if (typeof paddingModifier === 'number') {
    return {
      ...defaultPadding,
      paddingBlockStart: paddingModifier,
      paddingBlockEnd: paddingModifier,
      paddingInlineStart: paddingModifier,
      paddingInlineEnd: paddingModifier,
    }
  }
  if (typeof paddingModifier.block === 'number' || typeof paddingModifier.inline === 'number') {
    return {
      ...defaultPadding,
      paddingBlockStart:
        typeof paddingModifier.block === 'number'
          ? paddingModifier.block
          : defaultPadding.paddingBlockStart,
      paddingBlockEnd:
        typeof paddingModifier.block === 'number'
          ? paddingModifier.block
          : defaultPadding.paddingBlockEnd,
      paddingInlineStart:
        typeof paddingModifier.inline === 'number'
          ? paddingModifier.inline
          : defaultPadding.paddingInlineStart,
      paddingInlineEnd:
        typeof paddingModifier.inline === 'number'
          ? paddingModifier.inline
          : defaultPadding.paddingInlineEnd,
    }
  }
  return {
    paddingBlockStart: paddingModifier.block?.start ?? defaultPadding.paddingBlockStart,
    paddingBlockEnd: paddingModifier.block?.end ?? defaultPadding.paddingBlockEnd,
    paddingInlineStart: paddingModifier.inline?.start ?? defaultPadding.paddingInlineStart,
    paddingInlineEnd: paddingModifier.inline?.end ?? defaultPadding.paddingInlineEnd,
  }
}

type AbstractProps<Slot extends ElementType<{ className?: string; children?: ReactNode }>> =
  PropsWithChildren<{
    padding?: ListItemPaddingModifier
    slot?: { renderer: Slot; props?: ComponentPropsWithoutRef<Slot> }
    divider?: 'full' | 'content' | false
    status?: ReactNode
    heading: ReactNode
    action?: ReactNode
  }>

type ElementProps<Slot extends ElementType<{ className?: string; children?: ReactNode }>> = Omit<
  ComponentPropsWithoutRef<'li'>,
  keyof AbstractProps<Slot>
>

type Props<Slot extends ElementType<{ className?: string; children?: ReactNode }>> =
  AbstractProps<Slot> & ElementProps<Slot>

const classNameGenerator = (divider: 'full' | 'content' | false) =>
  tv({
    slots: {
      li: [
        'smarthr-ui-ListItem',
        'shr-flex shr-list-none shr-flex-col shr-bg-white',
        divider !== false &&
          'after:w-full after:shr-border-b-shorthand after:shr-flex after:shr-flex-col after:shr-content-[""]',
      ],
      slot: 'shr-no-underline focus-visible:shr-focus-indicator [&[href]:hover]:shr-bg-white-darken',
      content: 'shr-flex shr-flex-col [:focus-visible>&]:shr-focus-indicator',
    },
    variants: {
      paddingBlockStart: {
        0: {
          content: 'shr-pt-0',
        },
        0.025: {
          content: 'shr-pt-0.025',
        },
        0.5: {
          content: 'shr-pt-0.5',
        },
        1: {
          content: 'shr-pt-1',
        },
        1.5: {
          content: 'shr-pt-1.5',
        },
      },
      paddingBlockEnd: {
        0: {
          content: 'shr-pb-0',
        },
        0.025: {
          content: 'shr-pb-0.025',
        },
        0.5: {
          content: 'shr-pb-0.5',
        },
        1: {
          content: 'shr-pb-1',
        },
        1.5: {
          content: 'shr-pb-1.5',
        },
      },
      paddingInlineStart: {
        0: {
          li: divider === 'content' && 'after:shr-ms-0',
          content: 'shr-ps-0',
        },
        0.025: {
          li: divider === 'content' && 'after:shr-ms-0.025',
          content: 'shr-ps-0.025',
        },
        0.5: {
          li: divider === 'content' && 'after:shr-ms-0.5',
          content: 'shr-ps-0.5',
        },
        1: {
          li: divider === 'content' && 'after:shr-ms-1',
          content: 'shr-ps-1',
        },
        1.5: {
          li: divider === 'content' && 'after:shr-ms-1.5',
          content: 'shr-ps-1.5',
        },
      },
      paddingInlineEnd: {
        0: {
          li: divider === 'content' && 'after:shr-me-0',
          content: 'shr-pe-0',
        },
        0.025: {
          li: divider === 'content' && 'after:shr-me-0.025',
          content: 'shr-pe-0.025',
        },
        0.5: {
          li: divider === 'content' && 'after:shr-me-0.5',
          content: 'shr-pe-0.5',
        },
        1: {
          li: divider === 'content' && 'after:shr-me-1',
          content: 'shr-pe-1',
        },
        1.5: {
          li: divider === 'content' && 'after:shr-me-1.5',
          content: 'shr-pe-1.5',
        },
      },
    },
  })

type ListItem = <Slot extends ElementType<{ className?: string; children?: ReactNode }>>(
  props: Props<Slot>,
) => ReturnType<FC>

export const ListItem: ListItem = <
  Slot extends ElementType<{ className?: string; children?: ReactNode }>,
>({
  padding = 1,
  status,
  heading,
  action,
  divider: modifiedDivider,
  className,
  children,
  slot,
  ...rest
}: Props<Slot>) => {
  const inheritedDivider = useContext(ListDividerContext)
  const divider = modifiedDivider ?? inheritedDivider
  const { paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd } =
    mapPaddingModifierToPadding(padding)
  const actualClassName = useMemo(() => {
    const generatedClasses = classNameGenerator(divider)()
    return {
      li: generatedClasses.li({
        className,
        paddingBlockStart,
        paddingBlockEnd,
        paddingInlineStart,
        paddingInlineEnd,
      }),
      slot: generatedClasses.slot({}),
      content: generatedClasses.content({
        paddingBlockStart,
        paddingBlockEnd,
        paddingInlineStart,
        paddingInlineEnd,
      }),
    }
  }, [className, divider, paddingBlockStart, paddingBlockEnd, paddingInlineStart, paddingInlineEnd])
  const SlotRenderer = slot?.renderer ?? 'div'

  return (
    <li {...rest} className={actualClassName.li}>
      <SectioningFragment>
        {/* @ts-expect-error 型が複雑で推論できないため */}
        <SlotRenderer {...slot?.props} className={actualClassName.slot}>
          <div className={actualClassName.content}>
            <Sidebar right align="center" gap={0.5}>
              <Stack align="start" gap={0.5}>
                {status}
                <Heading className="shr-inline-flex">
                  <Text size="M" leading="NORMAL" className="shr-inline-block">
                    {heading}
                  </Text>
                </Heading>
                <Text as="p" leading="TIGHT" size="S" color="TEXT_GREY">
                  {children}
                </Text>
              </Stack>
              {action}
            </Sidebar>
          </div>
        </SlotRenderer>
      </SectioningFragment>
    </li>
  )
}

type ListItemAnchorProps<Slot extends ElementType<{ className?: string; children?: ReactNode }>> =
  Omit<Props<Slot>, 'action'> & { href: ComponentPropsWithoutRef<'a'>['href'] }

type ListItemAnchor = <Slot extends ElementType<{ className?: string; children?: ReactNode }>>(
  props: ListItemAnchorProps<Slot>,
) => ReturnType<FC>

export const ListItemAnchor: ListItemAnchor = <
  Slot extends ElementType<{ className?: string; children?: ReactNode }>,
>({
  slot,
  href,
  padding,
  ...rest
}: ListItemAnchorProps<Slot>) => {
  const slotRenderer = slot?.renderer || 'a'
  const slotProps = { ...slot?.props, href }
  return (
    <ListItem
      {...rest}
      slot={{ renderer: slotRenderer, props: slotProps }}
      padding={padding ?? { inline: { end: 0.5 } }}
      action={<FaChevronRightIcon color="TEXT_LINK" />}
    />
  )
}
