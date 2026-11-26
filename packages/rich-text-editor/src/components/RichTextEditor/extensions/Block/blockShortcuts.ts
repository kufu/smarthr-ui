/**
 * 移動は Google ドキュメントの「段落を移動」と同じ割り当て。Mod+Shift+↑/↓ は macOS で
 * 「文書の先頭・末尾まで選択」なので取らない
 */
export const getBlockShortcuts = (isApple: boolean) => {
  const moveModifiers = isApple ? 'Ctrl-Shift' : 'Alt-Shift'

  return {
    moveUp: `${moveModifiers}-ArrowUp`,
    moveDown: `${moveModifiers}-ArrowDown`,
    menu: 'Mod-/',
  } as const
}
