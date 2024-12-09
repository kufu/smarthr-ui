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

  const includesSelected = value && options.some((option) => option.value === value)
  const getRovingTabIndex = useCallback(
    (option: Option, index: number) => {
      if (isFocused) {
        return -1
      }
      if (!includesSelected) {
        return index === 0 ? 0 : -1
      }
      return option.value === value ? 0 : -1
    },
    [includesSelected, isFocused, value],
  )

  return (
    <div
      {...props}
      className={containerStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      ref={containerRef}
      role="toolbar"
    >
      <div role="radiogroup" className={buttonGroupStyle}>
        {options.map((option, i) => {
          const onClick = onClickOption ? () => onClickOption(option.value) : undefined

          return (
            <Button
              aria-label={option.ariaLabel}
              key={option.value}
              disabled={option.disabled}
              onClick={onClick}
              size={size}
              square={isSquare}
              tabIndex={getRovingTabIndex(option, i)}
              role="radio"
              aria-checked={!!value && value === option.value}
              className={buttonStyle}
            >
              {option.content}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
