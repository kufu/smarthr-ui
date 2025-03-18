'use client'

import React, {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { getIsInclude, mapToKeyArray } from '../../libs/map'
import { Heading, type HeadingTagTypes } from '../Heading'
import { FaCaretDownIcon, FaCaretRightIcon } from '../Icon'
import { Cluster } from '../Layout'

import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import {
  focusFirstSibling,
  focusLastSibling,
  focusNextSibling,
  focusPreviousSibling,
  getNewExpandedItems,
} from './accordionPanelHelper'

import type { TextProps } from '../Text'

type Props = PropsWithChildren<{
  /** ヘッダ部分のテキストのスタイル */
  headingType?: TextProps['styleType']
  /**
   * @deprecated headingTag属性は非推奨です
   */
  headingTag?: HeadingTagTypes
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'button'>, keyof Props>

const classNameGenerator = tv({
  slots: {
    title: 'shr-grow shr-leading-tight',
    button: [
      'smarthr-ui-AccordionPanel-trigger',
      'shr-group shr-bg-transparent shr-border-none shr-appearance-none shr-w-full shr-px-1 shr-py-0.75 shr-cursor-pointer shr-text-inherit shr-text-color-inherit shr-text-left',
      'disabled:shr-bg-white-darken disabled:shr-text-disabled disabled:shr-cursor-not-allowed',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      // Base 直下に AccordionPanel がある場合、背景が付き抜けないように角丸を指定（Base に overflow: hidden を与えるとフォーカスリングが表示されなくなる）
      '[.smarthr-ui-Base_>_.smarthr-ui-AccordionPanel_.smarthr-ui-AccordionPanel-item:first-child_&]:shr-rounded-t-l [.smarthr-ui-Base_>_.smarthr-ui-AccordionPanel_.smarthr-ui-AccordionPanel-item:last-child_&]:shr-rounded-b-l',
    ],
    leftIcon: 'shr-transition-transform shr-duration-100 group-aria-expanded:shr-rotate-90',
    rightIcon: 'group-aria-expanded:-shr-rotate-180',
  },
  compoundSlots: [
    {
      slots: ['leftIcon', 'rightIcon'],
      className: 'shr-shrink-0',
    },
  ],
})

export const AccordionPanelTrigger: FC<Props & ElementProps> = ({
  children,
  className,
  headingType = 'blockTitle',
  headingTag,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { title, button, leftIcon, rightIcon } = classNameGenerator()

    return {
      title: title(),
      button: button({ className }),
      leftIcon: leftIcon(),
      rightIcon: rightIcon(),
    }
  }, [className])

  const { name } = useContext(AccordionPanelItemContext)
  const {
    iconPosition,
    expandedItems,
    onClickTrigger,
    onClickProps,
    expandableMultiply,
    parentRef,
  } = useContext(AccordionPanelContext)

  const isExpanded = useMemo(() => getIsInclude(expandedItems, name), [expandedItems, name])

  const actualOnClickTrigger = useMemo(
    () =>
      onClickTrigger
        ? (e: React.MouseEvent<HTMLButtonElement>) =>
            onClickTrigger(e.currentTarget.value, !isExpanded)
        : undefined,
    [isExpanded, onClickTrigger],
  )
  const actualOnClickProps = useMemo(
    () =>
      onClickProps
        ? (e: React.MouseEvent<HTMLButtonElement>) => {
            const newExpandedItems = getNewExpandedItems(
              expandedItems,
              e.currentTarget.value,
              !isExpanded,
              expandableMultiply,
            )
            onClickProps(mapToKeyArray(newExpandedItems))
          }
        : undefined,
    [isExpanded, expandedItems, expandableMultiply, onClickProps],
  )
  const handleClick = useMemo(() => {
    if (actualOnClickTrigger) {
      if (actualOnClickProps) {
        return (e: React.MouseEvent<HTMLButtonElement>) => {
          actualOnClickTrigger(e)
          actualOnClickProps(e)
        }
      }

      return actualOnClickTrigger
    } else if (actualOnClickProps) {
      return actualOnClickProps
    }

    return undefined
  }, [actualOnClickProps, actualOnClickTrigger])

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = useCallback(
    (e): void => {
      if (!parentRef?.current) {
        return
      }

      const item = e.target as HTMLElement

      switch (e.key) {
        case 'Home': {
          e.preventDefault()
          focusFirstSibling(parentRef.current)
          break
        }
        case 'End': {
          e.preventDefault()
          focusLastSibling(parentRef.current)
          break
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault()
          focusPreviousSibling(item, parentRef.current)
          break
        }
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault()
          focusNextSibling(item, parentRef.current)
          break
        }
      }
    },
    [parentRef],
  )

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Heading tag={headingTag} type={headingType}>
      <button
        {...props}
        type="button"
        value={name}
        id={`${name}-trigger`}
        aria-expanded={isExpanded}
        aria-controls={`${name}-content`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={classNames.button}
        data-component="AccordionHeaderButton"
      >
        <MemoizedTitle iconPosition={iconPosition} classNames={classNames}>
          {children}
        </MemoizedTitle>
      </button>
    </Heading>
  )
}

const MemoizedTitle = React.memo<
  PropsWithChildren<{
    iconPosition: undefined | 'left' | 'right'
    classNames: { leftIcon: string; rightIcon: string; title: string }
  }>
>(({ classNames, iconPosition, children }) => (
  <Cluster className="shr-flex-nowrap" align="center" as="span">
    {iconPosition === 'left' && <FaCaretRightIcon className={classNames.leftIcon} />}
    <span className={classNames.title}>{children}</span>
    {iconPosition === 'right' && <FaCaretDownIcon className={classNames.rightIcon} />}
  </Cluster>
))
