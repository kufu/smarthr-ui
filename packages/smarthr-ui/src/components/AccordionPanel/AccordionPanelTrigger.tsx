'use client'

import {
  type ComponentPropsWithoutRef,
  type FC,
  type KeyboardEventHandler,
  type MouseEvent,
  type PropsWithChildren,
  memo,
  useContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { getIsInclude } from '../../libs/map'
import { Heading, type HeadingTagTypes } from '../Heading'
import { FaCaretDownIcon, FaCaretRightIcon } from '../Icon'
import { Cluster } from '../Layout'

import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'

import type { TextProps } from '../Text'

type AbstractProps = PropsWithChildren<{
  /** ヘッダ部分のテキストのスタイル */
  headingType?: Exclude<TextProps['styleType'], 'screenTitle'>
  /**
   * 可能な限り利用せず、SectioningContent(Article, Aside, Nav, Section)を使ってHeadingと関連する範囲を明確に指定する方法を検討してください
   */
  unrecommendedHeadingTag?: HeadingTagTypes
}>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'button'>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    title: 'shr-grow shr-leading-tight',
    titleWrapper: 'shr-flex-nowrap',
    button: [
      'smarthr-ui-AccordionPanel-trigger',
      'shr-group shr-w-full shr-cursor-pointer shr-appearance-none shr-border-none shr-bg-transparent shr-px-1 shr-py-0.75 shr-text-left shr-text-inherit shr-text-color-inherit',
      'disabled:shr-cursor-not-allowed disabled:shr-bg-white-darken disabled:shr-text-disabled',
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

export const AccordionPanelTrigger: FC<Props> = ({
  children,
  className,
  headingType = 'blockTitle',
  unrecommendedHeadingTag,
  ...rest
}) => {
  const classNames = useMemo(() => {
    const { title, titleWrapper, button, leftIcon, rightIcon } = classNameGenerator()

    return {
      title: title(),
      titleWrapper: titleWrapper(),
      button: button({ className }),
      leftIcon: leftIcon(),
      rightIcon: rightIcon(),
    }
  }, [className])

  const { name, contentId, triggerId } = useContext(AccordionPanelItemContext)
  const { iconPosition, expandedItems, handleClickTrigger, handleKeyDown } =
    useContext(AccordionPanelContext)

  const isExpanded = useMemo(() => getIsInclude(expandedItems, name), [expandedItems, name])

  return (
    <MemoizedHeadingButton
      {...rest}
      name={name}
      triggerId={triggerId}
      isExpanded={isExpanded}
      contentId={contentId}
      actualOnClick={handleClickTrigger}
      handleKeyDown={handleKeyDown}
      classNames={classNames}
      iconPosition={iconPosition}
      headingType={headingType}
      unrecommendedHeadingTag={unrecommendedHeadingTag}
    >
      {children}
    </MemoizedHeadingButton>
  )
}

const MemoizedHeadingButton = memo<
  PropsWithChildren<
    Omit<ComponentPropsWithoutRef<'button'>, 'onClick' | 'onKeyDown'> & {
      name: string
      triggerId: string
      isExpanded: boolean
      contentId: string
      actualOnClick: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined
      handleKeyDown: KeyboardEventHandler<HTMLButtonElement>
      classNames: {
        button: string
        titleWrapper: string
        leftIcon: string
        rightIcon: string
        title: string
      }
      iconPosition: 'left' | 'right'
      headingType: Exclude<TextProps['styleType'], 'screenTitle'>
      unrecommendedHeadingTag?: HeadingTagTypes
    }
  >
>(
  ({
    children,
    name,
    triggerId,
    isExpanded,
    contentId,
    actualOnClick,
    handleKeyDown,
    classNames,
    iconPosition,
    headingType,
    unrecommendedHeadingTag,
    ...rest
  }) => (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Heading unrecommendedTag={unrecommendedHeadingTag} type={headingType}>
      <button
        {...rest}
        type="button"
        value={name}
        id={triggerId}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={actualOnClick}
        onKeyDown={handleKeyDown}
        className={classNames.button}
        data-component="AccordionHeaderButton"
      >
        {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
        <Cluster className={classNames.titleWrapper} align="center" as="span">
          {iconPosition === 'left' && <FaCaretRightIcon className={classNames.leftIcon} />}
          <span className={classNames.title}>{children}</span>
          {iconPosition === 'right' && <FaCaretDownIcon className={classNames.rightIcon} />}
        </Cluster>
      </button>
    </Heading>
  ),
)
