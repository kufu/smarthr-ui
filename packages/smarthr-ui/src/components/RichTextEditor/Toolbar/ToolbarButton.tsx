'use client'

import { type ComponentPropsWithRef, type FC, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { useIsApplePlatform } from '../hooks/useIsApplePlatform'

import { ToolbarTooltip } from './ToolbarTooltip'
import { toAriaKeyShortcuts } from './shortcutKeys'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-RichTextEditor-ToolbarButton',
    'shr-inline-flex shr-items-center shr-justify-center',
    'shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-p-0.5 shr-text-base shr-text-black',
    'hover:shr-bg-white-darken',
    'focus-visible:shr-focus-indicator',
    'disabled:shr-cursor-default disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
  ],
  variants: {
    active: {
      true: [
        // shr-text-main（#0077c7）だと shr-bg-main/10 の上で 4.11:1、hover の
        // shr-bg-main/20 では 3.70:1 となり 4.5:1 を下回る。1段暗くして
        // 5.11:1 / 4.59:1 を確保する。
        // textColor に main-darken が無いため theme() で colors から直接引く。
        // プリセットにユーティリティを増やさず、この用途だけで閉じるため。
        'shr-bg-main/10 shr-text-[theme(colors.main-darken)] hover:shr-bg-main/20',
      ],
    },
  },
})

type Props = {
  icon: ReactNode
  label: string
  active?: boolean
  /** Tiptap 表記のショートカット（例: `Mod-B`） */
  shortcut?: string
} & Omit<ComponentPropsWithRef<'button'>, 'children'>

export const ToolbarButton: FC<Props> = memo(
  ({ icon, label, active = false, shortcut, className, ref, disabled, ...rest }) => {
    const isApple = useIsApplePlatform()

    return (
      <ToolbarTooltip label={label} shortcut={shortcut} suppressed={disabled}>
        <button
          {...rest}
          ref={ref}
          type="button"
          disabled={disabled}
          aria-label={label}
          aria-pressed={active}
          aria-keyshortcuts={shortcut ? toAriaKeyShortcuts(shortcut, isApple) : undefined}
          className={classNameGenerator({ active, className })}
        >
          {icon}
        </button>
      </ToolbarTooltip>
    )
  },
)
