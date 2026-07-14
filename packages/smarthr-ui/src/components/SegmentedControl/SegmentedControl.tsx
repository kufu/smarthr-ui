'use client'

import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'
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
  size?: 'M' | 'S'
}
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    container: 'smarthr-ui-SegmentedControl shr-inline-flex',
    buttonGroup: 'shr-flex',
    button: [
      'smarthr-ui-SegmentedControl-button',
      'shr-m-0 shr--ml-px shr-rounded-none',
      'focus-visible:shr-focus-indicator',
      'first:shr-ml-0 first:shr-rounded-bl-m first:shr-rounded-tl-m',
      'last:shr-rounded-br-m last:shr-rounded-tr-m',

      '[&:not([aria-checked="true"]):focus-visible]:shr-relative [&:not([aria-checked="true"]):focus-visible]:shr-border-x',

      // ::before: フォーカスリングと前のボタンの右端の間の隙間を埋めるために、左端から2px外側に1pxの縦線を描画する。
      // 非選択かつ先頭以外のボタンにフォーカスが当たったときのみ表示する
      'before:-shr-left-[2px] before:shr-hidden before:shr-h-[calc(100%+2px)] before:shr-w-px before:shr-bg-border before:shr-content-[""]',
      '[&:first-child]:before:shr-hidden [&:not([aria-checked="true"]):not(:first-child):focus-visible]:before:shr-absolute [&:not([aria-checked="true"]):not(:first-child):focus-visible]:before:shr-block',

      // ::after: フォーカスリングと次のボタンの左端の間の隙間を埋めるために、右端から2px外側に1pxの縦線を描画する。
      // 非選択かつ末尾以外のボタンにフォーカスが当たったときのみ表示する
      'after:-shr-right-[2px] after:shr-hidden after:shr-h-[calc(100%+2px)] after:shr-w-px after:shr-bg-border after:shr-content-[""]',
      '[&:last-child]:after:shr-hidden [&:not([aria-checked="true"]):not(:last-child):focus-visible]:after:shr-absolute [&:not([aria-checked="true"]):not(:last-child):focus-visible]:after:shr-block',
    ],
  },
  variants: {
    size: {
      M: {
        button: '[&:has(>_span_>_.smarthr-ui-Icon:only-child)]:shr-p-0.75',
      },
      S: {
        button: 'shr-p-0.5',
      },
    },
  },
})

export const SegmentedControl: FC<Props> = ({
  options,
  value,
  onClickOption,
  size = 'M',
  className,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const latest = useLatest({ onClickOption })

  const classNames = useMemo(() => {
    const { container, buttonGroup, button } = classNameGenerator()

    return {
      container: container({ className }),
      buttonGroup: buttonGroup(),
      button: button({ size }),
    }
  }, [className, size])

  const onDelegateFocus = () => setIsFocused(true)
  const onDelegateBlur = () => setIsFocused(false)

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

  const excludesSelected = !value || options.every((option) => option.value !== value)

  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      latest.onClickOption?.(e.currentTarget.value)
    },
    [latest],
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
            optionValue={option.value}
            optionContent={option.content}
            optionAriaLabel={option.ariaLabel}
            optionDisabled={option.disabled}
            index={index}
            onClick={onClick}
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

const SegmentedControlButton = memo<
  Pick<Props, 'size' | 'value'> & {
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
    optionValue: string
    optionContent: ReactNode
    optionAriaLabel?: string
    optionDisabled?: boolean
    index: number
    isFocused: boolean
    excludesSelected: boolean
    className: string
  }
>(
  ({
    onClick,
    size,
    value,
    optionValue,
    optionContent,
    optionAriaLabel,
    optionDisabled,
    index,
    isFocused,
    excludesSelected,
    className,
  }) => {
    const checked = value === optionValue
    const tabIndex = !isFocused && (excludesSelected ? index === 0 : checked) ? 0 : -1

    return (
      // eslint-disable-next-line smarthr/best-practice-for-interactive-element
      <Button
        value={optionValue}
        disabled={optionDisabled}
        tabIndex={tabIndex}
        role="radio"
        aria-label={optionAriaLabel}
        aria-checked={checked && !!value}
        onClick={onClick}
        variant={checked ? 'primary' : 'secondary'}
        size={size}
        className={className}
      >
        {optionContent}
      </Button>
    )
  },
)
