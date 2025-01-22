'use client'

import React, {
  ComponentProps,
  FC,
  ReactNode,
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

type Props = {
  /** 選択肢の配列 */
  options: Option[]
  /** 選択中の値 */
  value?: string | null
  /** 選択肢を押下したときに発火するコールバック関数 */
  onClickOption?: (value: string) => void
  /** 各ボタンの大きさ */
  size?: 'default' | 's'
  /** 各ボタンを正方形にするかどうか。アイコンボタンを使用する場合に指定します。 */
  isSquare?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

const segmentedControl = tv({
  slots: {
    container: 'smarthr-ui-SegmentedControl shr-inline-flex',
    buttonGroup: '-shr-space-x-px',
    button: [
      'smarthr-ui-SegmentedControl-button',
      'shr-m-0',
      'shr-rounded-none',
      'aria-checked:shr-border-main',
      'aria-checked:shr-bg-main',
      'aria-checked:shr-text-white',
      'aria-checked:hover:shr-border-main/50',
      'aria-checked:hover:shr-bg-main/50',
      'focus-visible:shr-focus-indicator',
      'first:shr-rounded-tl-m',
      'first:shr-rounded-bl-m',
      'last:shr-rounded-tr-m',
      'last:shr-rounded-br-m',
    ],
  },
})

export const SegmentedControl: FC<Props & ElementProps> = ({
  options,
  value,
  onClickOption,
  size = 'default',
  isSquare = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { containerStyle, buttonGroupStyle, buttonStyle } = useMemo(() => {
    const { container, buttonGroup, button } = segmentedControl()

    return {
      containerStyle: container({ className }),
      buttonGroupStyle: buttonGroup(),
      buttonStyle: button(),
    }
  }, [className])

  const onFocus = useCallback(() => setIsFocused(true), [])
  const onBlur = useCallback(() => setIsFocused(false), [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
    },
    [isFocused],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const excludesSelected = useMemo(
    () => !value || options.every((option) => option.value !== value),
    [options, value],
  )

  const actualOnClickOption = useMemo(
    () =>
      onClickOption
        ? (e: React.MouseEvent<HTMLButtonElement>) => onClickOption(e.currentTarget.value)
        : undefined,
    [onClickOption],
  )

  return (
    <div
      {...props}
      className={containerStyle}
      onFocus={onFocus}
      onBlur={onBlur}
      ref={containerRef}
      role="toolbar"
    >
      <div role="radiogroup" className={buttonGroupStyle}>
        {options.map((option, index) => (
          <SegmentedControlButton
            key={option.value}
            option={option}
            index={index}
            onClick={actualOnClickOption}
            size={size}
            isSquare={isSquare}
            value={value}
            isFocused={isFocused}
            excludesSelected={excludesSelected}
            buttonStyle={buttonStyle}
          />
        ))}
      </div>
    </div>
  )
}

const SegmentedControlButton: FC<
  Pick<Props, 'size' | 'isSquare' | 'value'> & {
    onClick: undefined | ((e: React.MouseEvent<HTMLButtonElement>) => void)
    option: Props['options'][number]
    index: number
    isFocused: boolean
    excludesSelected: boolean
    buttonStyle: string
  }
> = ({
  onClick,
  size,
  isSquare,
  value,
  option,
  index,
  isFocused,
  excludesSelected,
  buttonStyle,
}) => {
  const checked = value === option.value
  const tabIndex = useMemo(() => {
    if (isFocused) {
      return -1
    }

    if (excludesSelected) {
      return index === 0 ? 0 : -1
    }

    return checked ? 0 : -1
  }, [excludesSelected, isFocused, checked, index])

  return (
    <Button
      role="radio"
      aria-label={option.ariaLabel}
      aria-checked={checked && !!value}
      disabled={option.disabled}
      tabIndex={tabIndex}
      value={option.value}
      onClick={onClick}
      size={size}
      square={isSquare}
      className={buttonStyle}
    >
      {option.content}
    </Button>
  )
}
