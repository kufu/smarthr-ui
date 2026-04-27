'use client'

import { type FC, type ReactNode, memo, useCallback, useMemo } from 'react'

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

import { ColorPickerButton } from './ColorPickerButton'
import { FontSizeDropdown } from './FontSizeDropdown'
import { HeadingDropdown } from './HeadingDropdown'
import { ImageInsertButton } from './ImageInsertButton'
import { LinkButton } from './LinkButton'
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
}

type CustomItem = {
  type: 'heading' | 'fontSize' | 'color' | 'image' | 'youtube' | 'link' | 'textAlign'
  key: string
  disabled: boolean
}

type ToolbarItem = ButtonItem | CustomItem

export const RichTextEditorToolbar: FC = memo(() => {
  const { editor, features } = useRichTextEditorContext()
  const { localize } = useIntl()
  const state = useToolbarState(editor)

  const items = useMemo(() => {
    const toolbarItems: ToolbarItem[] = []
    const has = (f: RichTextFeature) => features.includes(f)

    // undo / redo（featuresに関係なく常に表示）
    toolbarItems.push(
      {
        type: 'button',
        key: 'undo',
        icon: <FaArrowRotateLeftIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/undo', defaultText: '元に戻す' }),
        active: false,
        disabled: !state.canUndo,
        action: () => editor.chain().focus().undo().run(),
      },
      {
        type: 'button',
        key: 'redo',
        icon: <FaArrowRotateRightIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/redo', defaultText: 'やり直す' }),
        active: false,
        disabled: !state.canRedo,
        action: () => editor.chain().focus().redo().run(),
      },
    )

    // 見出しドロップダウン
    if (has('heading')) {
      toolbarItems.push({ type: 'heading', key: 'heading-dropdown', disabled: false })
    }

    // フォントサイズ
    if (has('fontSize')) {
      toolbarItems.push({
        type: 'fontSize',
        key: 'fontSize-dropdown',
        disabled: state.isInHeading,
      })
    }

    // テキスト書式
    if (has('bold')) {
      toolbarItems.push({
        type: 'button',
        key: 'bold',
        icon: <FaBoldIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/bold', defaultText: '太字' }),
        active: state.isBold,
        disabled: !state.canBold,
        action: () => editor.chain().focus().toggleBold().run(),
      })
    }
    if (has('italic')) {
      toolbarItems.push({
        type: 'button',
        key: 'italic',
        icon: <FaItalicIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/italic', defaultText: '斜体' }),
        active: state.isItalic,
        disabled: !state.canItalic,
        action: () => editor.chain().focus().toggleItalic().run(),
      })
    }
    if (has('underline')) {
      toolbarItems.push({
        type: 'button',
        key: 'underline',
        icon: <FaUnderlineIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/underline', defaultText: '下線' }),
        active: state.isUnderline,
        disabled: !state.canUnderline,
        action: () => editor.chain().focus().toggleUnderline().run(),
      })
    }
    if (has('strike')) {
      toolbarItems.push({
        type: 'button',
        key: 'strike',
        icon: <FaStrikethroughIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/strike', defaultText: '打ち消し線' }),
        active: state.isStrike,
        disabled: !state.canStrike,
        action: () => editor.chain().focus().toggleStrike().run(),
      })
    }
    if (has('code')) {
      toolbarItems.push({
        type: 'button',
        key: 'code',
        icon: <FaCodeIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/code', defaultText: 'インラインコード' }),
        active: state.isCode,
        disabled: !state.canCode,
        action: () => editor.chain().focus().toggleCode().run(),
      })
    }

    // 文字色
    if (has('color')) {
      toolbarItems.push({ type: 'color', key: 'color-picker', disabled: false })
    }

    // リンク
    if (has('link')) {
      toolbarItems.push({ type: 'link', key: 'link-button', disabled: false })
    }

    // テキスト配置
    if (has('textAlign')) {
      toolbarItems.push({ type: 'textAlign', key: 'textAlign-group', disabled: false })
    }

    // リスト・ブロック
    if (has('bulletList')) {
      toolbarItems.push({
        type: 'button',
        key: 'bulletList',
        icon: <FaListUlIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/bulletList',
          defaultText: '箇条書きリスト',
        }),
        active: state.isBulletList,
        disabled: !state.canBulletList,
        action: () => editor.chain().focus().toggleBulletList().run(),
      })
    }
    if (has('orderedList')) {
      toolbarItems.push({
        type: 'button',
        key: 'orderedList',
        icon: <FaListOlIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/orderedList',
          defaultText: '番号付きリスト',
        }),
        active: state.isOrderedList,
        disabled: !state.canOrderedList,
        action: () => editor.chain().focus().toggleOrderedList().run(),
      })
    }
    if (has('blockquote')) {
      toolbarItems.push({
        type: 'button',
        key: 'blockquote',
        icon: <FaQuoteLeftIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/blockquote', defaultText: '引用' }),
        active: state.isBlockquote,
        disabled: !state.canBlockquote,
        action: () => editor.chain().focus().toggleBlockquote().run(),
      })
    }
    if (has('codeBlock')) {
      toolbarItems.push({
        type: 'button',
        key: 'codeBlock',
        icon: <FaFileCodeIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/codeBlock',
          defaultText: 'コードブロック',
        }),
        active: state.isCodeBlock,
        disabled: !state.canCodeBlock,
        action: () => editor.chain().focus().toggleCodeBlock().run(),
      })
    }
    if (has('horizontalRule')) {
      toolbarItems.push({
        type: 'button',
        key: 'horizontalRule',
        icon: <FaRulerHorizontalIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/horizontalRule',
          defaultText: '水平線',
        }),
        active: false,
        disabled: false,
        action: () => editor.chain().focus().setHorizontalRule().run(),
      })
    }

    // 画像挿入
    if (has('image')) {
      toolbarItems.push({ type: 'image', key: 'image-insert', disabled: false })
    }

    // YouTube埋め込み
    if (has('youtube')) {
      toolbarItems.push({ type: 'youtube', key: 'youtube-insert', disabled: false })
    }

    return toolbarItems
  }, [features, state, editor, localize])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const disabledKeys = useMemo(
    () => new Set(items.map((item, i) => (item.disabled ? i : -1)).filter((i) => i >= 0)),
    [items],
  )

  const { getButtonProps } = useRovingToolbar({ disabledKeys, onEscape: handleEscape })
  const count = items.length

  const toolbarLabel = localize({
    id: 'smarthr-ui/RichTextEditor/toolbarLabel',
    defaultText: '書式設定',
  })

  return (
    <div
      role="toolbar"
      aria-label={toolbarLabel}
      aria-orientation="horizontal"
      className="smarthr-ui-RichTextEditor-Toolbar shr-border-b-shorthand shr-flex shr-flex-wrap shr-items-center shr-gap-0.25 shr-px-0.5 shr-py-0.25"
    >
      {items.map((item, index) => {
        const rovingProps = getButtonProps(index, count)
        if (item.type === 'heading') {
          return <HeadingDropdown {...rovingProps} key={item.key} />
        }
        if (item.type === 'fontSize') {
          return <FontSizeDropdown {...rovingProps} key={item.key} />
        }
        if (item.type === 'color') {
          return <ColorPickerButton {...rovingProps} key={item.key} />
        }
        if (item.type === 'image') {
          return <ImageInsertButton {...rovingProps} key={item.key} />
        }
        if (item.type === 'youtube') {
          return <YoutubeInsertButton {...rovingProps} key={item.key} />
        }
        if (item.type === 'link') {
          return <LinkButton {...rovingProps} key={item.key} />
        }
        if (item.type === 'textAlign') {
          return <TextAlignDropdown {...rovingProps} key={item.key} />
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
            onClick={buttonItem.action}
          />
        )
      })}
    </div>
  )
})
