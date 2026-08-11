'use client'

import {
  type FC,
  Fragment,
  type ReactNode,
  memo,
  useCallback,
  useId,
  useMemo,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../../hooks/useEnvironment'
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
  FaMinusIcon,
  FaQuoteLeftIcon,
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
import { MoreFormatsToggle } from './MoreFormatsToggle'
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

// 1段目に置くグループ。残り（semantics / insertion）はモバイル時に2段目へ回す
const PRIMARY_GROUP_IDS: ReadonlyArray<ToolbarGroup['id']> = ['history', 'decoration']

const classNameGenerator = tv({
  slots: {
    toolbar: [
      'smarthr-ui-RichTextEditor-Toolbar',
      'shr-border-b-shorthand shr-flex shr-items-center shr-gap-0.25 shr-p-0.5',
    ],
    row: '',
    toggleWrapper: '',
    // グループの切れ目を示すだけの装飾要素。h-1.5（24px）は各項目の高さ32px（toolbarItemStyle）
    // に対して上下に余白が残る値。mx-0.5（8px）はツールバーのgap-0.25（4px）と
    // 合わせて左右12px空ける。デスクトップの折り返しでも、モバイルの横スクロールでも
    // 潰れずに一定幅を保つようshrink-0を付ける。
    separator:
      'smarthr-ui-RichTextEditor-ToolbarSeparator shr-mx-0.5 shr-h-1.5 shr-w-px shr-shrink-0 shr-bg-border',
  },
  variants: {
    mobile: {
      true: {
        // 段を縦に積む。items-stretch は各段を横幅いっぱいに広げてスクロール領域を確保するため
        toolbar: 'shr-flex-col shr-items-stretch',
        // 折り返しをやめて横スクロールにする。これが高さを1段分に固定する要。
        // overflow-x が auto だと CSS 仕様上 overflow-y も auto に計算されるため、
        // 段の内側に絶対配置されるツールチップは ToolbarTooltip 側で抑制している。
        row: 'shr-flex shr-flex-nowrap shr-items-center shr-gap-0.25 shr-overflow-x-auto',
        // 横スクロールしても常に見えるよう右端に固定する。背景はツールバーと同色にして
        // 下を流れる項目を隠す。pl-0.25 は隣の項目との間に隙間を作るため
        toggleWrapper:
          'shr-sticky shr-right-0 shr-flex shr-shrink-0 shr-items-center shr-bg-white shr-pl-0.25',
      },
      false: {
        toolbar: 'shr-flex-wrap',
      },
    },
    disabled: {
      true: {
        // RichTextEditor 側の toolbarWrapper が disabled で bg-white-darken になるため合わせる
        toggleWrapper: 'shr-bg-white-darken',
      },
    },
  },
})

export const RichTextEditorToolbar: FC = memo(() => {
  const { editor, features, disabled } = useRichTextEditorContext()
  const { mobile } = useEnvironment()
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false)
  const secondaryId = useId()
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
        icon: <FaMinusIcon />,
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
        ...group,
        items: group.items.map((item) => ({ ...item, disabled: true })),
      }))
    }

    return filled
  }, [features, state, editor, localize, disabled])

  // デスクトップでは分割しない（1段に全項目を並べる現状の見た目を維持する）
  const rows = useMemo(() => {
    if (!mobile) return { primary: groups, secondary: [] as typeof groups }

    return {
      primary: groups.filter((group) => PRIMARY_GROUP_IDS.includes(group.id)),
      secondary: groups.filter((group) => !PRIMARY_GROUP_IDS.includes(group.id)),
    }
  }, [groups, mobile])

  const hasToggle = rows.secondary.length > 0

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  // 閉じたあとにトグルへ focus() を呼び直してはいない。閉じる操作はこのトグルの
  // クリック・キー操作でしか起きず、その時点でフォーカスは既にトグル上にあるため。
  // 2段目の項目にフォーカスがある状態で unmount されることは無い。
  const handleToggleClick = useCallback(() => {
    setIsSecondaryOpen((prev) => !prev)
  }, [])

  // 区切り線をフォーカス対象に含めないため、ボタンの通し番号は描画前に確定させる。
  // JSX の中でカウンタを進めると描画が副作用を持つため useMemo の中で振る。
  // 順番は DOM 順（1段目 → トグル → 2段目）に合わせる。これで左右キーの移動が見た目と一致する。
  const indexedRows = useMemo(() => {
    let index = 0

    const assign = (target: typeof groups) =>
      target.map((group) => ({
        id: group.id,
        items: group.items.map((item) => ({ item, index: index++ })),
      }))

    const primary = assign(rows.primary)
    const toggleIndex = hasToggle ? index++ : -1
    const secondary = isSecondaryOpen ? assign(rows.secondary) : []

    return { primary, toggleIndex, secondary }
  }, [rows, hasToggle, isSecondaryOpen])

  // roving tabindex の各indexが無効かどうかを、indexedRows と同じ順番で並べた配列。
  // トグルは項目の型（ToolbarItem）に含めず、ここでフラグだけ差し込む。
  const disabledFlags = useMemo(() => {
    const toDisabled = (target: typeof groups) =>
      target.flatMap((group) => group.items).map((item) => item.disabled)

    const primary = toDisabled(rows.primary)
    const secondary = isSecondaryOpen ? toDisabled(rows.secondary) : []

    return hasToggle ? [...primary, !!disabled, ...secondary] : [...primary, ...secondary]
  }, [rows, hasToggle, isSecondaryOpen, disabled])

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

  const classNames = useMemo(() => {
    const { toolbar, row, toggleWrapper, separator } = classNameGenerator({ mobile, disabled })

    return {
      toolbar: toolbar(),
      row: row(),
      toggleWrapper: toggleWrapper(),
      separator: separator(),
    }
  }, [mobile, disabled])

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

  const renderGroups = (target: typeof indexedRows.primary) =>
    target.map((group, groupIndex) => (
      <Fragment key={group.id}>
        {groupIndex > 0 && <div aria-hidden="true" className={classNames.separator} />}
        {group.items.map(({ item, index }) => renderItem(item, index))}
      </Fragment>
    ))

  return (
    <div
      role="toolbar"
      aria-label={toolbarLabel}
      // 2段になっても操作は左右キー1本の直線移動なので horizontal のままが実態に合う
      aria-orientation="horizontal"
      className={classNames.toolbar}
    >
      {mobile ? (
        <>
          <div className={classNames.row}>
            {renderGroups(indexedRows.primary)}
            {indexedRows.toggleIndex >= 0 && (
              <div className={classNames.toggleWrapper}>
                <MoreFormatsToggle
                  {...getButtonProps(indexedRows.toggleIndex, count)}
                  expanded={isSecondaryOpen}
                  controls={secondaryId}
                  disabled={disabled}
                  handleClick={handleToggleClick}
                />
              </div>
            )}
          </div>
          {isSecondaryOpen && hasToggle && (
            <div id={secondaryId} className={classNames.row}>
              {renderGroups(indexedRows.secondary)}
            </div>
          )}
        </>
      ) : (
        renderGroups(indexedRows.primary)
      )}
    </div>
  )
})
