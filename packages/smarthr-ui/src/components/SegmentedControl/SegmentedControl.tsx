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
  'aria-label'?: string
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
  const unstableRef = useRef({ onClickOption, isFocused })
  unstableRef.current = { onClickOption, isFocused }
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
      if (!unstableRef.current.isFocused || !containerRef.current || !document.activeElement) {
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
  }, [])

  const excludesSelected = useMemo(
    () => !value || options.every((option) => option.value !== value),
    [value, options],
  )

  const actualOnClickOption = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    unstableRef.current.onClickOption?.(e.currentTarget.value)
  }, [])

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
            value={option.value}
            content={option.content}
            aria-label={option['aria-label']}
            disabled={option.disabled}
            index={index}
            onClick={onClickOption ? actualOnClickOption : undefined}
            size={size}
            selectedValue={value}
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
  Pick<Props, 'size'> &
    Omit<Props['options'][number], 'content'> & {
      content: ReactNode
      onClick: undefined | ((e: MouseEvent<HTMLButtonElement>) => void)
      selectedValue: Props['value']
      index: number
      isFocused: boolean
      excludesSelected: boolean
      className: string
    }
> = ({ onClick, selectedValue, content, value, index, isFocused, excludesSelected, ...rest }) => {
  const checked = selectedValue === value

  const tabIndex = isFocused ? -1 : excludesSelected ? (index === 0 ? 0 : -1) : checked ? 0 : -1

  return (
    // eslint-disable-next-line smarthr/best-practice-for-interactive-element
    <Button
      {...rest}
      value={value}
      tabIndex={tabIndex}
      role="radio"
      aria-checked={checked && !!selectedValue}
      onClick={onClick}
      variant={checked ? 'primary' : 'secondary'}
    >
      {content}
    </Button>
  )
}
