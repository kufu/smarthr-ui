'use client'

import {
  type FC,
  Fragment,
  type ReactNode,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  FaArrowRotateLeftIcon,
  FaArrowRotateRightIcon,
  FaBoldIcon,
  FaCodeIcon,
  FaFileCodeIcon,
  FaItalicIcon,
  FaListOlIcon,
  FaListUlIcon,
  FaMinusIcon,
  FaQuoteLeftIcon,
  FaStrikethroughIcon,
  FaUnderlineIcon,
} from 'smarthr-ui'
import { tv } from 'tailwind-variants'

import { useEnhancedEffect } from '../../../hooks/useEnhancedEffect'
import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
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
import { ToolbarWrapToggle } from './ToolbarWrapToggle'
import { YoutubeInsertButton } from './YoutubeInsertButton'

import type { RichTextFeature } from '../types'

type ButtonItem = {
  type: 'button'
  key: string
  icon: ReactNode
  label: string
  active?: boolean
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

const classNameGenerator = tv({
  slots: {
    // items-start は、折り返して段が複数行になってもトグルを右上に留めるため
    toolbar: [
      'smarthr-ui-RichTextEditor-Toolbar',
      'shr-border-b-shorthand shr-flex shr-items-start shr-gap-0.25 shr-p-0.5',
    ],
    // min-w-0 が無いと段が内容の幅より縮まず、横スクロールが発生しない。
    // overflow-y は auto に計算されるのに任せず hidden を明示する（Scroller と同じ）
    row: [
      'smarthr-ui-RichTextEditor-ToolbarRow',
      'shr-flex shr-min-w-0 shr-flex-1 shr-items-center shr-gap-0.25',
      'shr-flex-nowrap shr-overflow-x-auto shr-overflow-y-hidden',
      'data-[wrapped]:shr-flex-wrap data-[wrapped]:shr-overflow-visible',
    ],
    // separator を流用すると「もう1つのコントロールのグループ」に見えるため、
    // 全高の罫線で別の領域として切る
    toggleWrapper:
      'shr-border-l-shorthand shr-flex shr-shrink-0 shr-items-start shr-self-stretch shr-pl-0.5',
    // グループの切れ目を示すだけの装飾要素。h-1.5（24px）は各項目の高さ32px（toolbarItemStyle）
    // に対して上下に余白が残る値。mx-0.5（8px）はツールバーのgap-0.25（4px）と
    // 合わせて左右12px空ける。折り返しでも横スクロールでも潰れずに一定幅を保つよう
    // shrink-0 を付ける。
    separator:
      'smarthr-ui-RichTextEditor-ToolbarSeparator shr-mx-0.5 shr-h-1.5 shr-w-px shr-shrink-0 shr-bg-border',
  },
})

const CLASS_NAMES = (() => {
  const { toolbar, row, toggleWrapper, separator } = classNameGenerator()

  return {
    toolbar: toolbar(),
    row: row(),
    toggleWrapper: toggleWrapper(),
    separator: separator(),
  }
})()

export const RichTextEditorToolbar: FC = memo(() => {
  const { editor, features, disabled } = useRichTextEditorContext()
  const [isWrapped, setIsWrapped] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
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
        disabled: !state.canUndo,
        action: () => editor.chain().focus().undo().run(),
        shortcut: 'Mod-Z',
      },
      {
        type: 'button',
        key: 'redo',
        icon: <FaArrowRotateRightIcon />,
        label: localize({ id: 'smarthr-ui/RichTextEditor/redo', defaultText: 'やり直す' }),
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
        icon: <FaMinusIcon />,
        label: localize({
          id: 'smarthr-ui/RichTextEditor/horizontalRule',
          defaultText: '水平線',
        }),
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
        ...group,
        items: group.items.map((item) => ({ ...item, disabled: true })),
      }))
    }

    return filled
  }, [features, state, editor, localize, disabled])

  // トグルの表示を溢れで決めているのは、押しても何も起きないボタンを見せないため
  const latest = useLatest({ isWrapped })

  const functions = useMemo(
    () => ({
      measureOverflow: () => {
        // 折り返し中は段が複数行に折れて scrollWidth が内容の幅を表さなくなる。
        // 測り直すとトグルが消えて横スクロール表示へ戻せなくなる
        if (latest.isWrapped) return

        const toolbar = toolbarRef.current
        const row = rowRef.current

        if (!toolbar || !row) return

        // 段ではなくツールバーの内寸と比べるのは、段はトグルが出るとその分だけ狭くなり、
        // トグル自身の有無が判定に混ざって同じ幅でも操作の履歴で結果が変わるため
        const { paddingLeft, paddingRight } = getComputedStyle(toolbar)
        const innerWidth =
          toolbar.clientWidth - (parseFloat(paddingLeft) || 0) - (parseFloat(paddingRight) || 0)

        setIsOverflowing(row.scrollWidth > innerWidth)
      },
    }),
    [latest],
  )

  // 内容の幅は見出しやフォントサイズのラベルが変わることでも動くため依存配列で絞れない。
  // 下の購読と分けているのは、同居させると状態が変わるたびに張り替えることになるため
  useEnhancedEffect(() => {
    functions.measureOverflow()
  })

  useEnhancedEffect(() => {
    if (isWrapped) return

    const el = rowRef.current

    if (!el) return

    const observer = new ResizeObserver(functions.measureOverflow)

    observer.observe(el)

    return () => observer.disconnect()
  }, [isWrapped, functions])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const handleToggleClick = useCallback(() => {
    setIsWrapped((prev) => !prev)
  }, [])

  // 区切り線をフォーカス対象に含めないため、ボタンの通し番号は描画前に確定させる。
  // JSX の中でカウンタを進めると描画が副作用を持つため useMemo の中で振る。
  // 順番は DOM 順（段の項目 → トグル）に合わせる。これで左右キーの移動が見た目と一致する。
  const indexedGroups = useMemo(() => {
    let index = 0

    return groups.map((group) => ({
      id: group.id,
      items: group.items.map((item) => ({ item, index: index++ })),
    }))
  }, [groups])

  // roving tabindex の各indexが無効かどうかを、indexedGroups と同じ順番で並べた配列。
  // トグルは項目の型（ToolbarItem）に含めず、ここでフラグだけ差し込む。
  const disabledFlags = useMemo(() => {
    const items = groups.flatMap((group) => group.items).map((item) => item.disabled)

    return isWrapped || isOverflowing ? [...items, !!disabled] : items
  }, [groups, isWrapped, isOverflowing, disabled])

  const toggleIndex = isWrapped || isOverflowing ? disabledFlags.length - 1 : -1

  const disabledKeys = useMemo(
    () =>
      new Set(disabledFlags.map((isDisabled, i) => (isDisabled ? i : -1)).filter((i) => i >= 0)),
    [disabledFlags],
  )

  const { getButtonProps } = useRovingToolbar({ disabledKeys, onEscape: handleEscape })
  const count = disabledFlags.length

  const toolbarLabel = localize({
    id: 'smarthr-ui/RichTextEditor/toolbarLabel',
    defaultText: '書式設定',
  })

  const renderItem = (item: ToolbarItem, index: number) => {
    const rovingProps = getButtonProps(index, count)

    if (item.type === 'heading') {
      return <HeadingDropdown {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'fontSize') {
      return <FontSizeDropdown {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'lineHeight') {
      return <LineHeightDropdown {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'color') {
      return <TextColorPickerButton {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'backgroundColor') {
      return (
        <BackgroundColorPickerButton {...rovingProps} key={item.key} disabled={item.disabled} />
      )
    }
    if (item.type === 'image') {
      return <ImageInsertButton {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'youtube') {
      return <YoutubeInsertButton {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'link') {
      return <LinkButton {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'textAlign') {
      return <TextAlignDropdown {...rovingProps} key={item.key} disabled={item.disabled} />
    }
    if (item.type === 'table') {
      return <TableInsertDropdown {...rovingProps} key={item.key} disabled={item.disabled} />
    }

    const buttonItem = item as ButtonItem

    return (
      <ToolbarButton
        {...rovingProps}
        key={buttonItem.key}
        disabled={buttonItem.disabled}
        toggle={buttonItem.active !== undefined}
        active={buttonItem.active}
        shortcut={buttonItem.shortcut}
        onClick={buttonItem.action}
        icon={buttonItem.icon}
        label={buttonItem.label}
      />
    )
  }

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      className={CLASS_NAMES.toolbar}
      aria-label={toolbarLabel}
      // 折り返して複数行になっても操作は左右キー1本の直線移動なので horizontal が実態に合う
      aria-orientation="horizontal"
    >
      <div ref={rowRef} className={CLASS_NAMES.row} data-wrapped={isWrapped || undefined}>
        {indexedGroups.map((group, groupIndex) => (
          <Fragment key={group.id}>
            {groupIndex > 0 && <div className={CLASS_NAMES.separator} aria-hidden="true" />}
            {group.items.map(({ item, index }) => renderItem(item, index))}
          </Fragment>
        ))}
      </div>
      {toggleIndex >= 0 && (
        <div className={CLASS_NAMES.toggleWrapper}>
          <ToolbarWrapToggle
            {...getButtonProps(toggleIndex, count)}
            disabled={disabled}
            wrapped={isWrapped}
            handleClick={handleToggleClick}
          />
        </div>
      )}
    </div>
  )
})
