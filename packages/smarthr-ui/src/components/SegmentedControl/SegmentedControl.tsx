'use client'

import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../Button'

export type Option = {
  /** 選択時に返される値 */
  value: string
  /** ボタンに表示する内容 */
  content: ReactNode
  /** ボタンの `aria-label` */
  ariaLabel?: string
  /** ボタンを disabled にするかどうか */
  disabled?: boolean
}

type AbstractProps = {
  /** 選択肢の配列 */
  options: Option[]
  /** 選択中の値 */
  value?: string | null
  /** 選択肢を押下したときに発火するコールバック関数 */
  onClickOption?: (value: string) => void
  /** 各ボタンの大きさ */
  size?: 'default' | 's'
}
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    container: 'smarthr-ui-SegmentedControl shr-inline-flex',
    buttonGroup: '-shr-space-x-px',
    button: [
      'smarthr-ui-SegmentedControl-button',
      'shr-m-0 shr-rounded-none',
      'focus-visible:shr-focus-indicator',
      'first:shr-rounded-bl-m first:shr-rounded-tl-m',
      'last:shr-rounded-br-m last:shr-rounded-tr-m',
    ],
  },
  variants: {
    size: {
      default: {
        button: '[&:has(>_span_>_.smarthr-ui-Icon:only-child)]:shr-p-0.75',
      },
      s: {
        button: 'shr-p-0.5',
      },
    },
  },
})

export const SegmentedControl: FC<Props> = ({
  options,
  value,
  onClickOption,
  size = 'default',
  className,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const classNames = useMemo(() => {
    const { container, buttonGroup, button } = classNameGenerator()

    return {
      container: container({ className }),
      buttonGroup: buttonGroup(),
      button: button({ size }),
    }
  }, [className, size])

  const onDelegateFocus = useCallback(() => setIsFocused(true), [])
  const onDelegateBlur = useCallback(() => setIsFocused(false), [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused || !containerRef.current || !document.activeElement) {
        return
      }

      const radios = Array.from(
        containerRef.current.querySelectorAll('[role="radio"]:not(:disabled)'),
      )

      if (radios.length < 2) {
        return
      }

      const focusedIndex = radios.indexOf(document.activeElement)

      if (focusedIndex === -1) {
        return
      }

      switch (e.key) {
        case 'Down':
        case 'ArrowDown':
        case 'Right':
        case 'ArrowRight': {
          const nextIndex = focusedIndex + 1
          const nextRadio = radios[nextIndex % radios.length]

          if (nextRadio instanceof HTMLButtonElement) {
            nextRadio.focus()
          }

          break
        }
        case 'Up':
        case 'ArrowUp':
        case 'Left':
        case 'ArrowLeft': {
          const nextIndex = focusedIndex - 1
          const nextRadio = radios[(nextIndex + radios.length) % radios.length]

          if (nextRadio instanceof HTMLButtonElement) {
            nextRadio.focus()
          }

          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFocused])

  const excludesSelected = useMemo(
    () => !value || options.every((option) => option.value !== value),
    [value, options],
  )

  const actualOnClickOption = useMemo(
    () =>
      onClickOption
        ? (e: MouseEvent<HTMLButtonElement>) => onClickOption(e.currentTarget.value)
        : undefined,
    [onClickOption],
  )

  return (
    <div
      {...rest}
      className={classNames.container}
      onFocus={onDelegateFocus}
      onBlur={onDelegateBlur}
      ref={containerRef}
      role="toolbar"
    >
      <div role="radiogroup" className={classNames.buttonGroup}>
        {options.map((option, index) => (
          <SegmentedControlButton
            key={option.value}
            option={option}
            index={index}
            onClick={actualOnClickOption}
            size={size}
            value={value}
            isFocused={isFocused}
            excludesSelected={excludesSelected}
            className={classNames.button}
          />
        ))}
      </div>
    </div>
  )
}

const SegmentedControlButton: FC<
  Pick<Props, 'size' | 'value'> & {
    onClick: undefined | ((e: MouseEvent<HTMLButtonElement>) => void)
    option: Props['options'][number]
    index: number
    isFocused: boolean
    excludesSelected: boolean
    className: string
  }
> = ({ onClick, size, value, option, index, isFocused, excludesSelected, className }) => {
  const attrs = useMemo(() => {
    const checked = value === option.value

    return {
      checked,
      ariaChecked: checked && !!value,
      variant: checked ? 'primary' : 'secondary',
    } as const
  }, [value, option.value])
  const tabIndex = useMemo(() => {
    if (isFocused) {
      return -1
    }

    if (excludesSelected) {
      return index === 0 ? 0 : -1
    }

    return attrs.checked ? 0 : -1
  }, [excludesSelected, isFocused, attrs.checked, index])

  return (
    // eslint-disable-next-line smarthr/best-practice-for-interactive-element
    <Button
      value={option.value}
      disabled={option.disabled}
      tabIndex={tabIndex}
      role="radio"
      aria-label={option.ariaLabel}
      aria-checked={attrs.ariaChecked}
      onClick={onClick}
      variant={attrs.variant}
      size={size}
      className={className}
    >
      {option.content}
    </Button>
  )
}
