'use client'

import { type KeyboardEvent, type ReactNode, useMemo, useRef } from 'react'
import { FaCaretDownIcon, FaCheckIcon } from 'smarthr-ui'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../hooks/useLatest'
import { tv } from '../../../libs/tv'
import { useIsApplePlatform } from '../hooks/useIsApplePlatform'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'

import { ToolbarTooltip } from './ToolbarTooltip'
import { toAriaKeyShortcuts } from './shortcutKeys'
import { TOOLBAR_ITEM_CLASS_NAME } from './toolbarItemStyle'

const classNameGenerator = tv({
  slots: {
    trigger: TOOLBAR_ITEM_CLASS_NAME,
    listbox: 'shr-border-shorthand shr-rounded-m shr-bg-white shr-shadow-layer-3',
    option: [
      'shr-flex shr-cursor-pointer shr-items-center shr-bg-transparent shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    checkIcon: 'shr-w-[1em] shr-shrink-0',
  },
  variants: {
    appearance: {
      list: {
        listbox: 'shr-max-h-[20em] shr-overflow-y-auto shr-py-0.25',
        option: 'shr-w-full shr-gap-0.5 shr-border-none shr-px-0.75 shr-py-0.5 shr-text-left',
      },
      heading: {
        listbox: [
          'shr-min-w-[10em] shr-py-0.25',
          // 選択肢ごとに文字サイズが違うため行の高さが揃わない。grid-auto-rows:1fr で
          // 全行を最も高い行に合わせる。固定値を書かずに済み、許可レベルが減って
          // 見出し1が消えた場合もその時点の最大に追従する。
          'shr-grid shr-grid-cols-1 [grid-auto-rows:1fr]',
        ],
        option:
          'shr-border-t-shorthand shr-w-full shr-gap-0.5 shr-px-0.75 shr-py-0.5 shr-text-left first:shr-border-t-0',
      },
      icons: {
        listbox: 'shr-flex shr-items-center shr-gap-0.25 shr-p-0.25',
        option:
          'shr-justify-center shr-rounded-m shr-border-none shr-p-0.5 aria-selected:shr-bg-white-darken',
      },
    },
  },
})

export type ToolbarListboxOption = {
  key: string
  /** icons では表示がアイコンだけになるため、名前とツールチップに使う */
  label: string
  content: ReactNode
  shortcut?: string
}

type Props = {
  label: string
  /** 現在の値。トリガーの名前に「ラベル: 値」として含める */
  valueLabel: string | number
  triggerContent: ReactNode
  options: readonly ToolbarListboxOption[]
  /** 選択中の選択肢の位置。どれも選ばれていなければ -1 */
  selectedIndex: number
  /** 選択中のものが無いときに開いてフォーカスする位置 */
  fallbackIndex?: number
  appearance: 'list' | 'heading' | 'icons'
  triggerClassName?: string
  listboxClassName?: string
  /** エディタへの適用だけを行う。閉じてトリガーへ戻す処理はこの部品が受け持つ */
  handleSelect: (index: number) => void
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ToolbarListboxDropdown = ({
  label,
  valueLabel,
  triggerContent,
  options,
  selectedIndex,
  fallbackIndex = 0,
  appearance,
  triggerClassName,
  listboxClassName,
  handleSelect,
  tabIndex = -1,
  disabled,
  onKeyDown,
  onFocus,
  ref,
}: Props) => {
  const isApple = useIsApplePlatform()
  const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
  const mergedTriggerRef = useMergeRefs(triggerRef, ref)
  const listboxRef = useRef<HTMLDivElement>(null)
  const isHorizontal = appearance === 'icons'

  const classNames = useMemo(() => {
    const generated = classNameGenerator({ appearance })

    return {
      trigger: generated.trigger({ className: triggerClassName }),
      listbox: generated.listbox({ className: listboxClassName }),
      option: generated.option(),
      checkIcon: generated.checkIcon(),
    }
  }, [appearance, triggerClassName, listboxClassName])

  const latest = useLatest({
    selectedIndex,
    fallbackIndex,
    isHorizontal,
    triggerRef,
    handleSelect,
    onKeyDown,
  })

  const functions = useMemo(() => {
    const getOptions = () =>
      listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? null

    const closeAndFocusTrigger = () => {
      setIsOpen(false)
      latest.triggerRef.current?.focus()
    }

    return {
      selectOption: (index: number) => {
        latest.handleSelect(index)
        closeAndFocusTrigger()
      },
      handleTriggerKeyDown: (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
            requestAnimationFrame(() => {
              const index = latest.selectedIndex >= 0 ? latest.selectedIndex : latest.fallbackIndex
              getOptions()?.[index]?.focus()
            })
            break
          case 'ArrowUp':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
            requestAnimationFrame(() => {
              const buttons = getOptions()
              buttons?.[buttons.length - 1]?.focus()
            })
            break
          default:
            latest.onKeyDown?.(e)
        }
      },
      handleOptionKeyDown: (e: KeyboardEvent) => {
        const buttons = getOptions()
        if (!buttons) return
        const currentIndex = Array.from(buttons).indexOf(e.currentTarget as HTMLElement)
        const nextKey = latest.isHorizontal ? 'ArrowRight' : 'ArrowDown'
        const prevKey = latest.isHorizontal ? 'ArrowLeft' : 'ArrowUp'

        switch (e.key) {
          case nextKey:
            e.preventDefault()
            e.stopPropagation()
            buttons[(currentIndex + 1) % buttons.length]?.focus()
            break
          case prevKey:
            e.preventDefault()
            e.stopPropagation()
            buttons[(currentIndex - 1 + buttons.length) % buttons.length]?.focus()
            break
          case 'Home':
            e.preventDefault()
            e.stopPropagation()
            buttons[0]?.focus()
            break
          case 'End':
            e.preventDefault()
            e.stopPropagation()
            buttons[buttons.length - 1]?.focus()
            break
          // ポータルは body 末尾にあり Tab の既定の移動先が無いため、Escape と同じくトリガーへ戻す
          case 'Escape':
          case 'Tab':
            e.preventDefault()
            e.stopPropagation()
            closeAndFocusTrigger()
            break
        }
      },
    }
  }, [setIsOpen, latest])

  return (
    <>
      <ToolbarTooltip suppressed={isOpen || disabled} label={label}>
        <button
          ref={mergedTriggerRef}
          type="button"
          disabled={disabled}
          tabIndex={tabIndex}
          className={classNames.trigger}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`${label}: ${valueLabel}`}
          onKeyDown={functions.handleTriggerKeyDown}
          onClick={() => setIsOpen((prev) => !prev)}
          onFocus={onFocus}
        >
          {triggerContent}
          <FaCaretDownIcon className="shr-shrink-0 shr-text-xs" />
        </button>
      </ToolbarTooltip>
      {renderDropdown(
        <div
          ref={listboxRef}
          role="listbox"
          className={classNames.listbox}
          aria-label={label}
          aria-orientation={isHorizontal ? 'horizontal' : undefined}
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex

            if (isHorizontal) {
              return (
                <ToolbarTooltip key={option.key} shortcut={option.shortcut} label={option.label}>
                  <button
                    role="option"
                    type="button"
                    className={classNames.option}
                    aria-selected={isSelected}
                    aria-label={option.label}
                    aria-keyshortcuts={
                      option.shortcut ? toAriaKeyShortcuts(option.shortcut, isApple) : undefined
                    }
                    onClick={() => functions.selectOption(index)}
                    onKeyDown={functions.handleOptionKeyDown}
                  >
                    {option.content}
                  </button>
                </ToolbarTooltip>
              )
            }

            return (
              <button
                key={option.key}
                role="option"
                type="button"
                className={classNames.option}
                aria-selected={isSelected}
                onClick={() => functions.selectOption(index)}
                onKeyDown={functions.handleOptionKeyDown}
              >
                <span className={classNames.checkIcon}>
                  {isSelected && <FaCheckIcon className="shr-text-main" />}
                </span>
                {option.content}
              </button>
            )
          })}
        </div>,
      )}
    </>
  )
}
