'use client'

import {
  type ComponentPropsWithRef,
  type FC,
  type ReactNode,
  memo,
  useEffect,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

const classNameGenerator = tv({
  slots: {
    wrapper: 'shr-relative shr-inline-block',
    button: [
      'smarthr-ui-RichTextEditor-ToolbarButton',
      'shr-inline-flex shr-items-center shr-justify-center',
      'shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-p-0.5 shr-text-base shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-default disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
    ],
    tooltip: [
      'shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr--translate-x-1/2 shr-whitespace-nowrap shr-rounded-m shr-bg-black shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-white',
      'shr-opacity-0 shr-transition-opacity',
    ],
  },
  variants: {
    active: {
      true: {
        button: 'shr-bg-main/10 shr-text-main hover:shr-bg-main/20',
      },
    },
    visible: {
      true: {
        tooltip: 'shr-opacity-100',
      },
    },
  },
})

type Props = {
  icon: ReactNode
  label: string
  active?: boolean
} & Omit<ComponentPropsWithRef<'button'>, 'children'>

export const ToolbarButton: FC<Props> = memo(
  ({ icon, label, active = false, className, ref, onFocus, onBlur, disabled, ...rest }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const visible = isHovered || isFocused

    useEffect(() => {
      if (disabled) {
        setIsHovered(false)
        setIsFocused(false)
      }
    }, [disabled])

    const classNames = classNameGenerator({ active, visible })

    return (
      <span
        className={classNames.wrapper()}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <button
          {...rest}
          ref={ref}
          type="button"
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          onFocus={(e) => {
            setIsFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            onBlur?.(e)
          }}
          className={classNames.button({ className })}
        >
          {icon}
        </button>
        <span aria-hidden className={classNames.tooltip()}>
          {label}
        </span>
      </span>
    )
  },
)
