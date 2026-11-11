type Modifier = 'control' | 'alt' | 'shift' | 'meta'

/** Apple HIG の表示順（⌃⌥⇧⌘）。aria-keyshortcuts の慣例とも一致する */
const MODIFIER_ORDER: readonly Modifier[] = ['control', 'alt', 'shift', 'meta']

const MODIFIER_ALIASES: Readonly<Record<string, Modifier>> = {
  ctrl: 'control',
  control: 'control',
  alt: 'alt',
  option: 'alt',
  shift: 'shift',
  cmd: 'meta',
  command: 'meta',
  meta: 'meta',
}

/** ⌘ のみ記号。他は語で表す方が、記号を知らない利用者にも読み取りやすい */
const APPLE_MODIFIER_LABELS: Readonly<Record<Modifier, string>> = {
  meta: '⌘',
  control: 'Control',
  alt: 'Option',
  shift: 'Shift',
}

const NON_APPLE_MODIFIER_LABELS: Readonly<Record<Modifier, string>> = {
  control: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
}

/**
 * ツールチップ表示用の並び順。そのプラットフォームの主要修飾キーを先頭に置く。
 * aria-keyshortcuts の並び順（MODIFIER_ORDER）とは別物なので混同しないこと。
 */
const APPLE_MODIFIER_DISPLAY_ORDER: readonly Modifier[] = ['meta', 'control', 'alt', 'shift']
const NON_APPLE_MODIFIER_DISPLAY_ORDER: readonly Modifier[] = ['control', 'alt', 'shift', 'meta']

/** aria-keyshortcuts が受け付ける修飾キー名。記号は使えない */
const ARIA_MODIFIER_NAMES: Readonly<Record<Modifier, string>> = {
  control: 'Control',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
}

/** aria-keyshortcuts のキー名は DOM の KeyboardEvent.key に揃える */
const ARIA_KEY_NAMES: Readonly<Record<string, string>> = {
  enter: 'Enter',
  escape: 'Escape',
  backspace: 'Backspace',
  delete: 'Delete',
  tab: 'Tab',
  space: 'Space',
}

type ParsedShortcut = {
  modifiers: Modifier[]
  key: string
}

/**
 * Tiptap 表記（`Mod-Shift-S`）を修飾キーとキーに分解する。
 * Mod の解決条件は @tiptap/core の normalizeKeyName と同じで、
 * Apple なら Meta、それ以外は Control。
 */
const parseShortcut = (shortcut: string, isApple: boolean): ParsedShortcut => {
  const parts = shortcut.split('-')
  const key = parts[parts.length - 1]
  const found = new Set<Modifier>()

  for (const part of parts.slice(0, -1)) {
    const lower = part.toLowerCase()

    if (lower === 'mod') {
      found.add(isApple ? 'meta' : 'control')
      continue
    }

    const modifier = MODIFIER_ALIASES[lower]
    if (modifier) {
      found.add(modifier)
    }
  }

  return {
    modifiers: MODIFIER_ORDER.filter((m) => found.has(m)),
    key,
  }
}

/** 英字1文字は大文字に揃える。数字や記号はそのまま */
const normalizeKeyLabel = (key: string) => (key.length === 1 ? key.toUpperCase() : key)

/**
 * ツールチップに `<kbd>` として箱付きで並べる表示トークンを返す。
 * 1つずつ枠で区切られるため、記号ではなく語で表した方が読み取りやすい。
 */
export const formatShortcutTokens = (shortcut: string, isApple: boolean): string[] => {
  const { modifiers, key } = parseShortcut(shortcut, isApple)
  const lowerKey = key.toLowerCase()
  const keyToken = ARIA_KEY_NAMES[lowerKey] ?? normalizeKeyLabel(key)

  const displayOrder = isApple ? APPLE_MODIFIER_DISPLAY_ORDER : NON_APPLE_MODIFIER_DISPLAY_ORDER
  const labels = isApple ? APPLE_MODIFIER_LABELS : NON_APPLE_MODIFIER_LABELS
  const foundModifiers = new Set(modifiers)
  const modifierTokens = displayOrder.filter((m) => foundModifiers.has(m)).map((m) => labels[m])

  return [...modifierTokens, keyToken]
}

/** aria-keyshortcuts 属性の値を返す */
export const toAriaKeyShortcuts = (shortcut: string, isApple: boolean): string => {
  const { modifiers, key } = parseShortcut(shortcut, isApple)
  const lowerKey = key.toLowerCase()
  const keyName = ARIA_KEY_NAMES[lowerKey] ?? normalizeKeyLabel(key)

  return [...modifiers.map((m) => ARIA_MODIFIER_NAMES[m]), keyName].join('+')
}
