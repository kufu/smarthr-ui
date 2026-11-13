'use client'

import { useEditorState } from '@tiptap/react'
import { exitSuggestion } from '@tiptap/suggestion'
import { type FC, type MouseEvent, memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { FaXmarkIcon } from 'smarthr-ui'

import { useEnhancedEffect } from '../../../../hooks/client/useEnhancedEffect'
import { usePortal } from '../../../../hooks/client/usePortal'
import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { findDelegateTarget } from '../../../../libs/delegate'
import { tv } from '../../../../libs/tv'
import { ColorSwatchFace } from '../../Toolbar/ColorPicker/ColorSwatch'
import { toAriaKeyShortcuts } from '../../Toolbar/shortcutKeys'
import { useIsApplePlatform } from '../../hooks/useIsApplePlatform'
import {
  BLOCK_CATALOG,
  type BlockCatalogEntry,
  isBlockAllowed,
  matchesBlockQuery,
} from '../blockCatalog'
import { type HeadingLevel, SUPPORTED_HEADING_LEVELS } from '../configureHeading'
import {
  type FloatingPlacement,
  VIEWPORT_PADDING,
  computeFloatingPlacement,
  measureFloatingHeight,
} from '../floatingGeometry'

import { SlashCommandPluginKey } from './SlashCommand'
import { SLASH_COLOR_GROUPS, type SlashColorGroup, type SlashColorOption } from './slashColors'

import type { RichTextFeature } from '../../types'
import type { Editor } from '@tiptap/react'

const classNameGenerator = tv({
  slots: {
    popup:
      'shr-rte-border-shorthand shr-rte-absolute shr-rte-z-overlap-base shr-rte-box-border shr-rte-w-[16rem] shr-rte-overflow-clip shr-rte-rounded-m shr-rte-bg-white shr-rte-shadow-layer-3',
    listbox: 'shr-rte-max-h-[20rem] shr-rte-min-h-0 shr-rte-overflow-y-auto shr-rte-py-0.25',
    groupLabel:
      'shr-rte-px-0.75 shr-rte-pb-0.25 shr-rte-pt-0.5 shr-rte-text-sm shr-rte-font-bold shr-rte-text-grey',
    // 選択中を背景色で示さないのは、smarthr-ui の Combobox が背景色を選んだ値に使い、↑↓ の移動先はフォーカスの枠で示すのに揃えるため
    option: [
      'shr-rte-flex shr-rte-cursor-pointer shr-rte-items-center shr-rte-gap-0.5 shr-rte-px-0.75 shr-rte-py-0.5 shr-rte-text-sm shr-rte-text-black',
      'aria-selected:shr-rte-focus-indicator',
    ],
    icon: 'shr-rte-flex shr-rte-shrink-0 shr-rte-text-grey',
    resetLead: 'shr-rte-grid shr-rte-shrink-0 shr-rte-place-items-center shr-rte-text-grey',
    resetSpacer: 'shr-rte-invisible shr-rte-col-start-1 shr-rte-row-start-1',
    resetMark: 'shr-rte-col-start-1 shr-rte-row-start-1',
    empty: 'shr-rte-m-0 shr-rte-px-0.75 shr-rte-py-0.5 shr-rte-text-sm shr-rte-text-grey',
    closeButton:
      'shr-rte-border-t-shorthand shr-rte-flex shr-rte-w-full shr-rte-shrink-0 shr-rte-cursor-pointer shr-rte-items-center shr-rte-justify-between shr-rte-gap-0.5 shr-rte-bg-white shr-rte-px-0.75 shr-rte-py-0.5 shr-rte-text-left shr-rte-text-sm shr-rte-text-black',
    closeKey: 'shr-rte-text-xs shr-rte-text-grey',
  },
})

const CLASS_NAMES = (() => {
  const {
    popup,
    listbox,
    groupLabel,
    option,
    icon,
    resetLead,
    resetSpacer,
    resetMark,
    empty,
    closeButton,
    closeKey,
  } = classNameGenerator()

  return {
    popup: popup(),
    listbox: listbox(),
    groupLabel: groupLabel(),
    option: option(),
    icon: icon(),
    resetLead: resetLead(),
    resetSpacer: resetSpacer(),
    resetMark: resetMark(),
    empty: empty(),
    closeButton: closeButton(),
    closeKey: closeKey(),
  }
})()

const BLOCK_GROUPS = [
  {
    group: 'text',
    label: { id: 'smarthr-ui/RichTextEditor/slashMenuTextGroup', defaultText: 'テキスト' },
  },
  {
    group: 'media',
    label: { id: 'smarthr-ui/RichTextEditor/slashMenuMediaGroup', defaultText: 'メディア' },
  },
] as const

type SlashItem = { label: string; optionId: string } & (
  | { kind: 'block'; entry: BlockCatalogEntry }
  | { kind: 'color'; group: SlashColorGroup; option: SlashColorOption }
)

type SlashSection = { id: string; label: string; items: SlashItem[] }

type SlashRange = { from: number; to: number }

const renderLead = (item: SlashItem) => {
  switch (item.kind) {
    case 'block': {
      const { icon: Icon } = item.entry

      return (
        <span className={CLASS_NAMES.icon} aria-hidden="true">
          <Icon />
        </span>
      )
    }
    case 'color':
      return item.option.type === 'swatch' ? (
        <ColorSwatchFace
          appearance={item.group.attribute}
          size="S"
          color={item.option.value}
          aria-hidden="true"
        />
      ) : (
        // 幅を数値で持たないのは、見本の大きさや枠が変わっても、色の名前と左端が揃い続けるようにするため
        <span className={CLASS_NAMES.resetLead} aria-hidden="true">
          <ColorSwatchFace
            appearance={item.group.attribute}
            size="S"
            color="transparent"
            className={CLASS_NAMES.resetSpacer}
          />
          <FaXmarkIcon className={CLASS_NAMES.resetMark} />
        </span>
      )
  }
}

const INITIAL_SELECTION = { query: '', index: 0 }

const CLOSE_SHORTCUT = 'Escape'
// ツールチップと同じ formatShortcutTokens の「Escape」にしないのは、項目の右端に添える控えめな表示にするため
const CLOSE_KEY_LABEL = 'esc'

type Props = {
  editor: Editor
  features: readonly RichTextFeature[]
  headingLevels?: readonly HeadingLevel[]
}

export const SlashMenu: FC<Props> = memo(({ editor, features, headingLevels }) => {
  const { localize } = useIntl()
  const { createPortal } = usePortal()
  const isApple = useIsApplePlatform()
  const idPrefix = useId()
  const listboxId = `${idPrefix}-listbox`
  const menuRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState(INITIAL_SELECTION)
  const [position, setPosition] = useState<FloatingPlacement | null>(null)

  const slash = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const state = SlashCommandPluginKey.getState(e.state)

      // blur で exitSuggestion を呼んで閉じない。閉じた範囲を Suggestion が覚え、本文に戻って
      // 打っても開き直らなくなる
      return state?.active && e.isFocused
        ? { from: state.range.from, to: state.range.to, query: state.query ?? '' }
        : null
    },
  })

  if (!slash && selection !== INITIAL_SELECTION) setSelection(INITIAL_SELECTION)

  const query = slash?.query ?? ''
  const allowedHeadingLevels = headingLevels ?? SUPPORTED_HEADING_LEVELS
  // storage を購読しない。開く関数はボタンのマウントに合わせて増減するだけで、開いている間は打鍵ごとに描き直すので足りる
  const openers = editor.storage.insertDialogs?.openers
  const sections: SlashSection[] = slash
    ? [
        ...BLOCK_GROUPS.map(({ group, label }) => ({
          id: group,
          label: localize(label),
          items: BLOCK_CATALOG.flatMap((entry): SlashItem[] => {
            const { creation } = entry

            if (
              entry.group !== group ||
              !creation ||
              !isBlockAllowed(entry, features, allowedHeadingLevels) ||
              (creation.type === 'dialog' && !openers?.[creation.dialog])
            ) {
              return []
            }

            const itemLabel = localize(entry.label)

            return matchesBlockQuery({ label: itemLabel, keywords: entry.keywords }, query)
              ? [{ kind: 'block', entry, label: itemLabel, optionId: `${idPrefix}-${entry.id}` }]
              : []
          }),
        })),
        ...SLASH_COLOR_GROUPS.map((group) => {
          const groupLabel = localize(group.label)

          return {
            id: group.attribute,
            label: groupLabel,
            items: features.includes(group.attribute)
              ? group.options.flatMap((option, index): SlashItem[] => {
                  const itemLabel = localize(option.label)
                  const keywords = [groupLabel, ...group.keywords, ...option.keywords]

                  return matchesBlockQuery({ label: itemLabel, keywords }, query)
                    ? [
                        {
                          kind: 'color',
                          group,
                          option,
                          label: itemLabel,
                          optionId: `${idPrefix}-${group.attribute}-${index}`,
                        },
                      ]
                    : []
                })
              : [],
          }
        }),
      ].filter((section) => section.items.length > 0)
    : []
  const items = sections.flatMap((section) => section.items)
  const activeIndex =
    selection.query === query && selection.index < items.length ? selection.index : 0
  const activeOptionId = items[activeIndex]?.optionId ?? null

  const latest = useLatest({ items, activeIndex, query })

  const functions = useMemo(() => {
    const runBlock = ({ creation }: BlockCatalogEntry, range: SlashRange) => {
      if (!creation) return false

      if (creation.type === 'command') {
        // run() の戻り値を返さない。途中のコマンドが失敗しても /query の削除は反映されており、
        // false で Enter を通すと、消したあとにさらに改行が入る
        creation.apply(editor.chain().deleteRange(range)).run()

        return true
      }

      const opener = editor.storage.insertDialogs?.openers[creation.dialog]

      if (!opener) return false

      editor.chain().deleteRange(range).run()
      opener({
        getAnchorRect: () => editor.view.coordsAtPos(editor.state.selection.from),
        returnFocus: () => {
          if (!editor.isDestroyed) editor.view.focus()
        },
      })

      return true
    }

    const runColor = (
      { attribute }: SlashColorGroup,
      option: SlashColorOption,
      range: SlashRange,
    ) => {
      const { storedMarks, doc, schema } = editor.state
      const textStyle = schema.marks.textStyle
      // setColor・unsetColor を使わないのは、/検索語 を消すと先に選んだ色の stored mark も消え、
      // unsetColor は中身の無い textStyle を stored mark に残して、そのまま本文に入れるため
      const marks = storedMarks ?? doc.resolve(range.to).marks()
      const attrs = {
        ...textStyle.isInSet(marks)?.attrs,
        [attribute]: option.type === 'swatch' ? option.value : null,
      }
      const otherMarks = textStyle.removeFromSet(marks)

      editor
        .chain()
        .deleteRange(range)
        .command(({ tr }) => {
          tr.setStoredMarks(
            Object.values(attrs).some(Boolean)
              ? textStyle.create(attrs).addToSet(otherMarks)
              : otherMarks,
          )

          return true
        })
        .run()

      return true
    }

    // 範囲を描画済みの値から読まないのは、打鍵の直後で描画が追いついていなくても、実際に打たれている範囲を消すため
    const run = (item: SlashItem) => {
      const state = SlashCommandPluginKey.getState(editor.state)

      if (!state?.active || !editor.isEditable) return false

      const range = { from: state.range.from, to: state.range.to }

      switch (item.kind) {
        case 'block':
          return runBlock(item.entry, range)
        case 'color':
          return runColor(item.group, item.option, range)
      }
    }

    const findItemIndex = (e: MouseEvent<HTMLDivElement>) => {
      const option = findDelegateTarget<HTMLElement>(e, '[role="option"]')

      return option ? latest.items.findIndex(({ optionId }) => optionId === option.id) : -1
    }

    return {
      handleKeyDown: (event: KeyboardEvent) => {
        if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return false

        const { items: currentItems, activeIndex: index } = latest

        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp': {
            if (currentItems.length === 0) return false

            const step = event.key === 'ArrowDown' ? 1 : -1

            setSelection({
              query: latest.query,
              index: (index + step + currentItems.length) % currentItems.length,
            })

            return true
          }
          case 'Enter': {
            const item = currentItems[index]

            return item ? run(item) : false
          }
          default:
            return false
        }
      },
      handleDelegateMouseDown: (e: MouseEvent<HTMLDivElement>) => e.preventDefault(),
      handleDelegateClick: (e: MouseEvent<HTMLDivElement>) => {
        const item = latest.items[findItemIndex(e)]

        if (item) run(item)
      },
      // mouseover で受けないのは、↑↓ で一覧がスクロールするとポインタの下の項目に mouseover が届き、選択が引き戻されるため
      handleDelegateMouseMove: (e: MouseEvent<HTMLDivElement>) => {
        const index = findItemIndex(e)

        if (index !== -1 && index !== latest.activeIndex) {
          setSelection({ query: latest.query, index })
        }
      },
      handleCloseClick: () => exitSuggestion(editor.view, SlashCommandPluginKey),
    }
  }, [editor, latest])

  useEffect(() => {
    const storage = editor.storage.slashCommand

    if (!storage) return undefined

    storage.handleKeyDown = functions.handleKeyDown

    return () => {
      if (storage.handleKeyDown === functions.handleKeyDown) storage.handleKeyDown = null
    }
  }, [editor, functions])

  const isOpen = slash !== null
  const noMatchOptionId = `${idPrefix}-no-match`
  // 該当なしを live region で知らせないのは、aria-activedescendant を外すと読み上げが本文に戻って
  // ラベルから本文まで読み直し、知らせがその後ろに埋もれるため
  const activeDescendantId = activeOptionId ?? noMatchOptionId

  useEffect(() => {
    if (!isOpen || editor.isDestroyed) return undefined

    const dom = editor.view.dom

    dom.setAttribute('aria-autocomplete', 'list')

    dom.setAttribute('aria-controls', listboxId)
    dom.setAttribute('aria-activedescendant', activeDescendantId)
    document.getElementById(activeDescendantId)?.scrollIntoView({ block: 'nearest' })

    return () => {
      dom.removeAttribute('aria-autocomplete')
      dom.removeAttribute('aria-controls')
      dom.removeAttribute('aria-activedescendant')
    }
  }, [editor, isOpen, listboxId, activeDescendantId])

  const from = slash?.from ?? null
  const to = slash?.to ?? null
  const itemsKey = items.map(({ optionId }) => optionId).join(',')

  useEnhancedEffect(() => {
    const contentEl = menuRef.current

    if (from === null || to === null || !contentEl) return undefined

    const place = () => {
      if (editor.isDestroyed) return

      // 段落の先頭だけを起点にしないのは、検索語が折り返したときに入力中の行を覆うため
      const next = computeFloatingPlacement({
        anchor: { ...editor.view.coordsAtPos(from), bottom: editor.view.coordsAtPos(to).bottom },
        contentWidth: contentEl.offsetWidth,
        contentHeight: measureFloatingHeight(contentEl),
        viewport: { width: window.innerWidth, height: window.innerHeight },
        scroll: { x: window.pageXOffset, y: window.pageYOffset },
      })

      setPosition((prev) =>
        prev?.top === next.top && prev.left === next.left && prev.maxHeight === next.maxHeight
          ? prev
          : next,
      )
    }

    place()

    // bubble で受けないのは、要素のスクロールは window まで bubble せず、本文の内側のスクロールを拾えないため。
    // 描画を待たないのは、1フレーム元の位置に残るため
    const handleScroll = (e: Event) => {
      if (!contentEl.contains(e.target as Node)) flushSync(place)
    }
    const handleResize = () => flushSync(place)

    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [editor, from, to, itemsKey])

  if (!slash) return null

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      ref={menuRef}
      className={CLASS_NAMES.popup}
      style={{
        top: `${position?.top ?? 0}px`,
        left: `${position?.left ?? 0}px`,
        maxWidth: `calc(100vw - ${VIEWPORT_PADDING * 2}px)`,
        maxHeight: position?.maxHeight ? `${position.maxHeight}px` : undefined,
        display: position?.maxHeight ? 'flex' : undefined,
        flexDirection: position?.maxHeight ? 'column' : undefined,
        visibility: position ? undefined : 'hidden',
      }}
      onMouseDown={functions.handleDelegateMouseDown}
      onClick={functions.handleDelegateClick}
      onMouseMove={functions.handleDelegateMouseMove}
    >
      <div
        role="listbox"
        id={listboxId}
        className={CLASS_NAMES.listbox}
        aria-label={localize({
          id: 'smarthr-ui/RichTextEditor/slashMenu',
          defaultText: 'ブロックと色',
        })}
      >
        {items.length === 0 && (
          <div
            role="option"
            id={noMatchOptionId}
            className={CLASS_NAMES.empty}
            aria-selected={false}
            aria-disabled="true"
          >
            {localize({
              id: 'smarthr-ui/RichTextEditor/slashMenuNoMatch',
              defaultText: '該当する項目がありません。',
            })}
          </div>
        )}
        {sections.map(({ id, label, items: sectionItems }) => {
          const groupLabelId = `${idPrefix}-${id}`

          return (
            <div key={id} role="group" aria-labelledby={groupLabelId}>
              <div id={groupLabelId} className={CLASS_NAMES.groupLabel}>
                {label}
              </div>
              {sectionItems.map((item) => (
                <div
                  key={item.optionId}
                  role="option"
                  id={item.optionId}
                  className={CLASS_NAMES.option}
                  aria-selected={item.optionId === activeOptionId}
                  aria-label={
                    item.kind === 'color' && item.option.type === 'swatch'
                      ? `${label}: ${item.label}`
                      : undefined
                  }
                >
                  {renderLead(item)}
                  {item.label}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      {/* option にしないのは、↑↓ の移動先に入れないため */}
      <button
        type="button"
        tabIndex={-1}
        className={CLASS_NAMES.closeButton}
        aria-keyshortcuts={toAriaKeyShortcuts(CLOSE_SHORTCUT, isApple)}
        onClick={functions.handleCloseClick}
      >
        <span>
          {localize({
            id: 'smarthr-ui/RichTextEditor/slashMenuClose',
            defaultText: 'メニューを閉じる',
          })}
        </span>
        <span className={CLASS_NAMES.closeKey} aria-hidden="true">
          {CLOSE_KEY_LABEL}
        </span>
      </button>
    </div>,
  )
})
