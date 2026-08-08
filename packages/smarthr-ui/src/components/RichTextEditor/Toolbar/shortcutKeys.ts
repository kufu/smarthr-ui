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

const APPLE_MODIFIER_SYMBOLS: Readonly<Record<Modifier, string>> = {
  control: '⌃',
  alt: '⌥',
  shift: '⇧',
  meta: '⌘',
}

const NON_APPLE_MODIFIER_LABELS: Readonly<Record<Modifier, string>> = {
  control: 'Ctrl',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
}

/** aria-keyshortcuts が受け付ける修飾キー名。記号は使えない */
const ARIA_MODIFIER_NAMES: Readonly<Record<Modifier, string>> = {
  control: 'Control',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
}

const APPLE_KEY_SYMBOLS: Readonly<Record<string, string>> = {
  enter: '⏎',
  escape: '⎋',
  backspace: '⌫',
  delete: '⌦',
  tab: '⇥',
  space: '␣',
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
 * ツールチップに `<kbd>` として並べる表示トークンを返す。
 * Apple では記号のみを連結して表示する想定なので区切り文字は含めない。
 */
export const formatShortcutTokens = (shortcut: string, isApple: boolean): string[] => {
  const { modifiers, key } = parseShortcut(shortcut, isApple)
  const lowerKey = key.toLowerCase()

  const keyToken = isApple
    ? (APPLE_KEY_SYMBOLS[lowerKey] ?? normalizeKeyLabel(key))
    : (ARIA_KEY_NAMES[lowerKey] ?? normalizeKeyLabel(key))

  const modifierTokens = modifiers.map((m) =>
    isApple ? APPLE_MODIFIER_SYMBOLS[m] : NON_APPLE_MODIFIER_LABELS[m],
  )

  return [...modifierTokens, keyToken]
}

/** aria-keyshortcuts 属性の値を返す */
export const toAriaKeyShortcuts = (shortcut: string, isApple: boolean): string => {
  const { modifiers, key } = parseShortcut(shortcut, isApple)
  const lowerKey = key.toLowerCase()
  const keyName = ARIA_KEY_NAMES[lowerKey] ?? normalizeKeyLabel(key)

  return [...modifiers.map((m) => ARIA_MODIFIER_NAMES[m]), keyName].join('+')
}
