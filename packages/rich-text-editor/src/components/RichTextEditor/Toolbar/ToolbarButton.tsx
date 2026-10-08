'use client'

import { type ComponentPropsWithRef, type FC, type ReactNode, memo } from 'react'

import { tv } from '../../../libs/tv'
import { useIsApplePlatform } from '../hooks/useIsApplePlatform'

import { ToolbarTooltip } from './ToolbarTooltip'
import { toAriaKeyShortcuts } from './shortcutKeys'
import { TOOLBAR_ITEM_CLASS_NAME } from './toolbarItemStyle'

const classNameGenerator = tv({
  base: [
    TOOLBAR_ITEM_CLASS_NAME,
    'smarthr-ui-RichTextEditor-ToolbarButton',
    // tv の variants で指定しないのは、押下状態が変わるたびにクラス名を作り直さないため。
    // 属性セレクタなら base の shr-rte-bg-transparent / shr-rte-text-black を詳細度で上回る。
    'data-[active]:shr-rte-bg-main data-[active]:shr-rte-text-white',
    'data-[active]:hover:shr-rte-bg-main-darken',
    // 押下中の disabled は Button の primary に合わせる
    'data-[active]:disabled:shr-rte-bg-main/50 data-[active]:disabled:shr-rte-text-white/50',
    'data-[active]:disabled:hover:shr-rte-bg-main/50',
  ],
})

type Props = {
  icon: ReactNode
  label: string
  /** 選択状態。見た目にのみ反映する */
  active?: boolean
  /**
   * 押下で active を切り替えるボタンかどうか。aria-pressed は切り替えボタンとして
   * 読み上げられるため、ダイアログを開くだけのボタンや状態を持たないボタンでは出さない。
   */
  toggle?: boolean
  /** Tiptap 表記のショートカット（例: `Mod-B`） */
  shortcut?: string
} & Omit<ComponentPropsWithRef<'button'>, 'children'>

export const ToolbarButton: FC<Props> = memo(
  ({
    icon,
    label,
    active,
    toggle,
    shortcut,
    className,
    ref,
    disabled,
    'aria-expanded': ariaExpanded,
    ...rest
  }) => {
    const isApple = useIsApplePlatform()

    return (
      <ToolbarTooltip
        shortcut={shortcut}
        suppressed={disabled || ariaExpanded === true || ariaExpanded === 'true'}
        label={label}
      >
        <button
          {...rest}
          ref={ref}
          type="button"
          disabled={disabled}
          className={classNameGenerator({ className })}
          aria-label={label}
          aria-expanded={ariaExpanded}
          aria-pressed={toggle ? active : undefined}
          aria-keyshortcuts={shortcut ? toAriaKeyShortcuts(shortcut, isApple) : undefined}
          data-active={active || undefined}
        >
          {icon}
        </button>
      </ToolbarTooltip>
    )
  },
)
