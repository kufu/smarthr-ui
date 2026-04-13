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

import { ToolbarButton } from './ToolbarButton'

import type { RichTextFeature } from '../types'

type ButtonItem = {
  key: string
  icon: ReactNode
  label: string
  active: boolean
  disabled: boolean
  action: () => void
}

export const RichTextEditorToolbar: FC = memo(() => {
  const { editor, features } = useRichTextEditorContext()
  const { localize } = useIntl()
  const state = useToolbarState(editor)

  const buttons = useMemo(() => {
    const items: ButtonItem[] = []
    const has = (f: RichTextFeature) => features.includes(f)

    // undo / redo（featuresに関係なく常に表示）
    items.push(
      {
        key: 'undo',
        icon: <FaArrowRotateLeftIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/undo', defaultText: '元に戻す' }),
        active: false,
        disabled: !state.canUndo,
        action: () => editor.chain().focus().undo().run(),
      },
      {
        key: 'redo',
        icon: <FaArrowRotateRightIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/redo', defaultText: 'やり直す' }),
        active: false,
        disabled: !state.canRedo,
        action: () => editor.chain().focus().redo().run(),
      },
    )

    // テキスト書式
    if (has('bold')) {
      items.push({
        key: 'bold',
        icon: <FaBoldIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/bold', defaultText: '太字' }),
        active: state.isBold,
        disabled: !state.canBold,
        action: () => editor.chain().focus().toggleBold().run(),
      })
    }
    if (has('italic')) {
      items.push({
        key: 'italic',
        icon: <FaItalicIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/italic', defaultText: '斜体' }),
        active: state.isItalic,
        disabled: !state.canItalic,
        action: () => editor.chain().focus().toggleItalic().run(),
      })
    }
    if (has('underline')) {
      items.push({
        key: 'underline',
        icon: <FaUnderlineIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/underline', defaultText: '下線' }),
        active: state.isUnderline,
        disabled: !state.canUnderline,
        action: () => editor.chain().focus().toggleUnderline().run(),
      })
    }
    if (has('strike')) {
      items.push({
        key: 'strike',
        icon: <FaStrikethroughIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/strike', defaultText: '打ち消し線' }),
        active: state.isStrike,
        disabled: !state.canStrike,
        action: () => editor.chain().focus().toggleStrike().run(),
      })
    }
    if (has('code')) {
      items.push({
        key: 'code',
        icon: <FaCodeIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/code', defaultText: 'インラインコード' }),
        active: state.isCode,
        disabled: !state.canCode,
        action: () => editor.chain().focus().toggleCode().run(),
      })
    }

    // 見出し
    if (has('heading')) {
      items.push(
        {
          key: 'heading1',
          // eslint-disable-next-line smarthr/require-i18n-text
          icon: <span aria-hidden>H1</span>,
          label: localize({ id: 'smarthr-ui/RichTextEditor/heading1', defaultText: '見出し1' }),
          active: state.isHeading1,
          disabled: false,
          action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          key: 'heading2',
          // eslint-disable-next-line smarthr/require-i18n-text
          icon: <span aria-hidden>H2</span>,
          label: localize({ id: 'smarthr-ui/RichTextEditor/heading2', defaultText: '見出し2' }),
          active: state.isHeading2,
          disabled: false,
          action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          key: 'heading3',
          // eslint-disable-next-line smarthr/require-i18n-text
          icon: <span aria-hidden>H3</span>,
          label: localize({ id: 'smarthr-ui/RichTextEditor/heading3', defaultText: '見出し3' }),
          active: state.isHeading3,
          disabled: false,
          action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          key: 'heading4',
          // eslint-disable-next-line smarthr/require-i18n-text
          icon: <span aria-hidden>H4</span>,
          label: localize({ id: 'smarthr-ui/RichTextEditor/heading4', defaultText: '見出し4' }),
          active: state.isHeading4,
          disabled: false,
          action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        },
      )
    }

    // リスト・ブロック
    if (has('bulletList')) {
      items.push({
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
      items.push({
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
      items.push({
        key: 'blockquote',
        icon: <FaQuoteLeftIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/blockquote', defaultText: '引用' }),
        active: state.isBlockquote,
        disabled: !state.canBlockquote,
        action: () => editor.chain().focus().toggleBlockquote().run(),
      })
    }
    if (has('codeBlock')) {
      items.push({
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
      items.push({
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

    return items
  }, [features, state, editor, localize])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const disabledKeys = useMemo(
    () => new Set(buttons.map((b, i) => (b.disabled ? i : -1)).filter((i) => i >= 0)),
    [buttons],
  )

  const { getButtonProps } = useRovingToolbar({ disabledKeys, onEscape: handleEscape })
  const count = buttons.length

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
      {buttons.map((button, index) => (
        <ToolbarButton
          {...getButtonProps(index, count)}
          key={button.key}
          icon={button.icon}
          label={button.label}
          active={button.active}
          disabled={button.disabled}
          onClick={button.action}
        />
      ))}
    </div>
  )
})
