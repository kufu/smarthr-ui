import React, {
  ComponentPropsWithoutRef,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { getIsInclude, mapToKeyArray } from '../../libs/map'
import { Heading, HeadingTagTypes, HeadingTypes } from '../Heading'
import { FaCaretDownIcon, FaCaretRightIcon } from '../Icon'
import { Cluster } from '../Layout'

import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import { getNewExpandedItems } from './accordionPanelHelper'

type Props = PropsWithChildren<{
  /** ヘッダ部分のテキストのスタイル */
  headingType?: HeadingTypes
  /**
   * @deprecated headingTag属性は非推奨です
   */
  headingTag?: HeadingTagTypes
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'button'>, keyof Props>

const accordionPanelTrigger = tv({
  slots: {
    title: 'shr-grow',
    button: [
      'smarthr-ui-AccordionPanel-trigger',
      'shr-group',
      'shr-bg-transparent',
      'shr-border-none',
      'shr-appearance-none',
      'shr-w-full',
      'shr-px-1',
      'shr-py-0.75',
      'shr-cursor-pointer',
      'shr-text-inherit',
      'shr-text-left',
      'hover:shr-bg-white-darken',
      'hover:shr-shadow-none',
      'focus-visible:shr-focus-indicator',
    ],
    leftIcon: 'shr-transition-transform shr-duration-100 group-aria-expanded:shr-rotate-90',
    rightIcon: 'group-aria-expanded:-shr-rotate-180',
  },
  compoundSlots: [
    {
      slots: ['leftIcon', 'rightIcon'],
      className: 'group-aria-expanded:shrink-0',
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
  const { titleStyle, buttonStyle, leftIconStyle, rightIconStyle } = useMemo(() => {
    const { title, button, leftIcon, rightIcon } = accordionPanelTrigger()
    return {
      titleStyle: title(),
      buttonStyle: button({ className }),
      leftIconStyle: leftIcon(),
      rightIconStyle: rightIcon(),
    }
  }, [className])
  const { name } = useContext(AccordionPanelItemContext)
  const { iconPosition, expandedItems, onClickTrigger, onClickProps, expandableMultiply } =
    useContext(AccordionPanelContext)

  const isExpanded = getIsInclude(expandedItems, name)

  const handleClick = useCallback(() => {
    if (onClickTrigger) onClickTrigger(name, !isExpanded)

    if (onClickProps) {
      const newExpandedItems = getNewExpandedItems(
        expandedItems,
        name,
        !isExpanded,
        expandableMultiply,
      )
      onClickProps(mapToKeyArray(newExpandedItems))
    }
  }, [onClickTrigger, name, isExpanded, onClickProps, expandedItems, expandableMultiply])

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Heading tag={headingTag} type={headingType}>
      <button
        {...props}
        id={`${name}-trigger`}
        aria-expanded={isExpanded}
        aria-controls={`${name}-content`}
        onClick={handleClick}
        className={buttonStyle}
        data-component="AccordionHeaderButton"
        type="button"
      >
        <Cluster className="shr-flex-nowrap" align="center" as="span">
          {iconPosition === 'left' && <FaCaretRightIcon className={leftIconStyle} />}
          <span className={titleStyle}>{children}</span>
          {iconPosition === 'right' && <FaCaretDownIcon className={rightIconStyle} />}
        </Cluster>
      </button>
    </Heading>
  )
}
