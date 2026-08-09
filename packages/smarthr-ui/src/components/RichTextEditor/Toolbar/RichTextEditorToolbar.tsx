'use client'

import { type FC, Fragment, type ReactNode, memo, useCallback, useMemo } from 'react'

import { useIntl } from '../../../intl'
import {
  FaArrowRotateLeftIcon,
  FaArrowRotateRightIcon,
  FaBoldIcon,
  FaCodeIcon,
  FaFileCodeIcon,
  FaItalicIcon,
  FaListOlIcon,
  FaListUlIcon,
  FaQuoteLeftIcon,
  FaRulerHorizontalIcon,
  FaStrikethroughIcon,
  FaUnderlineIcon,
} from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useRovingToolbar } from '../hooks/useRovingToolbar'
import { useToolbarState } from '../hooks/useToolbarState'

import { BackgroundColorPickerButton } from './ColorPicker/BackgroundColorPickerButton'
import { TextColorPickerButton } from './ColorPicker/TextColorPickerButton'
import { FontSizeDropdown } from './FontSizeDropdown'
import { HeadingDropdown } from './HeadingDropdown'
import { ImageInsertButton } from './ImageInsertButton'
import { LineHeightDropdown } from './LineHeightDropdown'
import { LinkButton } from './LinkButton'
import { TableInsertDropdown } from './TableInsertDropdown'
import { TextAlignDropdown } from './TextAlignDropdown'
import { ToolbarButton } from './ToolbarButton'
import { YoutubeInsertButton } from './YoutubeInsertButton'

import type { RichTextFeature } from '../types'

type ButtonItem = {
  type: 'button'
  key: string
  icon: ReactNode
  label: string
  active: boolean
  disabled: boolean
  action: () => void
  /**
   * Tiptap 表記のショートカット。Tiptap は拡張のキーバインドを外部へ公開して
   * いないため、拡張側の定義と二重管理になる。値を変えるときは対応する拡張の
   * addKeyboardShortcuts も確認すること。
   */
  shortcut?: string
}

type CustomItem = {
  type:
    | 'heading'
    | 'fontSize'
    | 'lineHeight'
    | 'color'
    | 'backgroundColor'
    | 'image'
    | 'youtube'
    | 'link'
    | 'textAlign'
    | 'table'
  key: string
  disabled: boolean
}

type ToolbarItem = ButtonItem | CustomItem

type ToolbarGroup = {
  id: 'history' | 'decoration' | 'semantics' | 'insertion'
  items: ToolbarItem[]
}

// グループの切れ目を示すだけの装飾要素。h-2（16px）はボタンの高さ24px・ドロップダウンの
// 高さ約25pxに対して上下に余白が残る値。mx-0.5（4px）はツールバーのgap-0.25（2px）と
// 合わせて左右6px空ける。折り返し前に潰れないようshrink-0を付ける。
const SEPARATOR_CLASS_NAME =
  'smarthr-ui-RichTextEditor-ToolbarSeparator shr-mx-0.5 shr-h-2 shr-w-px shr-shrink-0 shr-bg-border'

export const RichTextEditorToolbar: FC = memo(() => {
  const { editor, features, disabled } = useRichTextEditorContext()
  const { localize } = useIntl()
  const state = useToolbarState(editor)

  const groups = useMemo(() => {
    const has = (f: RichTextFeature) => features.includes(f)

    // 履歴操作（featuresに関係なく常に表示）
    const history: ToolbarItem[] = [
      {
        type: 'button',
        key: 'undo',
        icon: <FaArrowRotateLeftIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/undo', defaultText: '元に戻す' }),
        active: false,
        disabled: !state.canUndo,
        action: () => editor.chain().focus().undo().run(),
        shortcut: 'Mod-Z',
      },
      {
        type: 'button',
        key: 'redo',
        icon: <FaArrowRotateRightIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/redo', defaultText: 'やり直す' }),
        active: false,
        disabled: !state.canRedo,
        action: () => editor.chain().focus().redo().run(),
        shortcut: 'Shift-Mod-Z',
      },
    ]

    // テキスト装飾
    const decoration: ToolbarItem[] = []

    if (has('heading')) {
      decoration.push({
        type: 'heading',
        key: 'heading-dropdown',
        disabled: state.isNodeSelected,
      })
    }
    if (has('fontSize')) {
      decoration.push({
        type: 'fontSize',
        key: 'fontSize-dropdown',
        disabled: state.isInHeading || state.isNodeSelected,
      })
    }
    if (has('lineHeight')) {
      decoration.push({
        type: 'lineHeight',
        key: 'lineHeight-dropdown',
        disabled: state.isNodeSelected,
      })
    }
    if (has('bold')) {
      decoration.push({
        type: 'button',
        key: 'bold',
        icon: <FaBoldIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/bold', defaultText: '太字' }),
        active: state.isBold,
        disabled: !state.canBold,
        action: () => editor.chain().focus().toggleBold().run(),
        shortcut: 'Mod-B',
      })
    }
    if (has('italic')) {
      decoration.push({
        type: 'button',
        key: 'italic',
        icon: <FaItalicIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/italic', defaultText: '斜体' }),
        active: state.isItalic,
        disabled: !state.canItalic,
        action: () => editor.chain().focus().toggleItalic().run(),
        shortcut: 'Mod-I',
      })
    }
    if (has('underline')) {
      decoration.push({
        type: 'button',
        key: 'underline',
        icon: <FaUnderlineIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/underline', defaultText: '下線' }),
        active: state.isUnderline,
        disabled: !state.canUnderline,
        action: () => editor.chain().focus().toggleUnderline().run(),
        shortcut: 'Mod-U',
      })
    }
    if (has('strike')) {
      decoration.push({
        type: 'button',
        key: 'strike',
        icon: <FaStrikethroughIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/strike', defaultText: '打ち消し線' }),
        active: state.isStrike,
        disabled: !state.canStrike,
        action: () => editor.chain().focus().toggleStrike().run(),
        shortcut: 'Mod-Shift-S',
      })
    }
    if (has('color')) {
      decoration.push({ type: 'color', key: 'color-picker', disabled: state.isNodeSelected })
    }
    if (has('backgroundColor')) {
      decoration.push({
        type: 'backgroundColor',
        key: 'background-color-picker',
        disabled: state.isNodeSelected,
      })
    }
    if (has('textAlign')) {
      decoration.push({
        type: 'textAlign',
        key: 'textAlign-group',
        disabled: state.isNodeSelected,
      })
    }

    // テキストの意味づけ
    const semantics: ToolbarItem[] = []

    if (has('link')) {
      semantics.push({ type: 'link', key: 'link-button', disabled: state.isNodeSelected })
    }
    if (has('bulletList')) {
      semantics.push({
        type: 'button',
        key: 'bulletList',
        icon: <FaListUlIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/bulletList',
          defaultText: '箇条書きリスト',
        }),
        active: state.isBulletList,
        disabled: !state.canBulletList || state.isNodeSelected,
        action: () => editor.chain().focus().toggleBulletList().run(),
        shortcut: 'Mod-Shift-8',
      })
    }
    if (has('orderedList')) {
      semantics.push({
        type: 'button',
        key: 'orderedList',
        icon: <FaListOlIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/orderedList',
          defaultText: '番号付きリスト',
        }),
        active: state.isOrderedList,
        disabled: !state.canOrderedList || state.isNodeSelected,
        action: () => editor.chain().focus().toggleOrderedList().run(),
        shortcut: 'Mod-Shift-7',
      })
    }
    if (has('blockquote')) {
      semantics.push({
        type: 'button',
        key: 'blockquote',
        icon: <FaQuoteLeftIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/blockquote', defaultText: '引用' }),
        active: state.isBlockquote,
        disabled: !state.canBlockquote || state.isNodeSelected,
        action: () => editor.chain().focus().toggleBlockquote().run(),
        shortcut: 'Mod-Shift-B',
      })
    }
    if (has('code')) {
      semantics.push({
        type: 'button',
        key: 'code',
        icon: <FaCodeIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/code', defaultText: 'インラインコード' }),
        active: state.isCode,
        disabled: !state.canCode,
        action: () => editor.chain().focus().toggleCode().run(),
        shortcut: 'Mod-E',
      })
    }
    if (has('codeBlock')) {
      semantics.push({
        type: 'button',
        key: 'codeBlock',
        icon: <FaFileCodeIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/codeBlock',
          defaultText: 'コードブロック',
        }),
        active: state.isCodeBlock,
        disabled: !state.canCodeBlock || state.isNodeSelected,
        action: () => editor.chain().focus().toggleCodeBlock().run(),
        shortcut: 'Mod-Alt-C',
      })
    }

    // 挿入
    const insertion: ToolbarItem[] = []

    if (has('horizontalRule')) {
      insertion.push({
        type: 'button',
        key: 'horizontalRule',
        icon: <FaRulerHorizontalIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/horizontalRule',
          defaultText: '水平線',
        }),
        active: false,
        disabled: state.isNodeSelected,
        action: () => editor.chain().focus().setHorizontalRule().run(),
      })
    }
    if (has('table')) {
      insertion.push({ type: 'table', key: 'table-dropdown', disabled: state.isNodeSelected })
    }
    if (has('image')) {
      insertion.push({ type: 'image', key: 'image-insert', disabled: state.isNodeSelected })
    }
    if (has('youtube')) {
      insertion.push({ type: 'youtube', key: 'youtube-insert', disabled: state.isNodeSelected })
    }

    // features で全項目が外れたグループは区切り線も含めて描画しない
    // satisfies で ToolbarGroup[] の形を検証しつつ、id のリテラル型を維持する
    // （型注釈だと filter() の手前で object literal が widening されて id: string になる）
    const filled = (
      [
        { id: 'history', items: history },
        { id: 'decoration', items: decoration },
        { id: 'semantics', items: semantics },
        { id: 'insertion', items: insertion },
      ] satisfies ToolbarGroup[]
    ).filter((group) => group.items.length > 0)

    // editorのeditable解除だけではツールバー由来のコマンドは止まらない（Tiptapのcommandはeditableを見ない）ため、
    // 各itemのdisabledを一括で上書きしてネイティブのdisabled状態に落とす
    if (disabled) {
      return filled.map((group) => ({
        id: group.id,
        items: group.items.map((item) => ({ ...item, disabled: true })),
      }))
    }

    return filled
  }, [features, state, editor, localize, disabled])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  // 区切り線をフォーカス対象に含めないため、ボタンの通し番号は描画前に確定させる。
  // JSX の中でカウンタを進めると描画が副作用を持つため useMemo の中で振る。
  const indexedGroups = useMemo(() => {
    let index = 0

    return groups.map((group) => ({
      id: group.id,
      items: group.items.map((item) => ({ item, index: index++ })),
    }))
  }, [groups])

  const flatItems = useMemo(() => groups.flatMap((group) => group.items), [groups])

  const disabledKeys = useMemo(
    () => new Set(flatItems.map((item, i) => (item.disabled ? i : -1)).filter((i) => i >= 0)),
    [flatItems],
  )

  const { getButtonProps } = useRovingToolbar({ disabledKeys, onEscape: handleEscape })
  const count = flatItems.length

  const toolbarLabel = localize({
    id: 'smarthr-ui/RichTextEditor/toolbarLabel',
    defaultText: '書式設定',
  })

  const renderItem = (item: ToolbarItem, index: number) => {
    const rovingProps = getButtonProps(index, count)

    if (item.type === 'heading') {
      return <HeadingDropdown {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'fontSize') {
      return <FontSizeDropdown {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'lineHeight') {
      return <LineHeightDropdown {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'color') {
      return <TextColorPickerButton {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'backgroundColor') {
      return (
        <BackgroundColorPickerButton {...rovingProps} disabled={item.disabled} key={item.key} />
      )
    }
    if (item.type === 'image') {
      return <ImageInsertButton {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'youtube') {
      return <YoutubeInsertButton {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'link') {
      return <LinkButton {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'textAlign') {
      return <TextAlignDropdown {...rovingProps} disabled={item.disabled} key={item.key} />
    }
    if (item.type === 'table') {
      return <TableInsertDropdown {...rovingProps} disabled={item.disabled} key={item.key} />
    }

    const buttonItem = item as ButtonItem

    return (
      <ToolbarButton
        {...rovingProps}
        key={buttonItem.key}
        icon={buttonItem.icon}
        label={buttonItem.label}
        active={buttonItem.active}
        disabled={buttonItem.disabled}
        shortcut={buttonItem.shortcut}
        onClick={buttonItem.action}
      />
    )
  }

  return (
    <div
      role="toolbar"
      aria-label={toolbarLabel}
      aria-orientation="horizontal"
      className="smarthr-ui-RichTextEditor-Toolbar shr-border-b-shorthand shr-flex shr-flex-wrap shr-items-center shr-gap-0.25 shr-px-0.5 shr-py-0.25"
    >
      {indexedGroups.map((group, groupIndex) => (
        <Fragment key={group.id}>
          {groupIndex > 0 && <div aria-hidden="true" className={SEPARATOR_CLASS_NAME} />}
          {group.items.map(({ item, index }) => renderItem(item, index))}
        </Fragment>
      ))}
    </div>
  )
})
