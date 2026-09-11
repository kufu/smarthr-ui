import { textblockTypeInputRule } from '@tiptap/core'

import type { AnyExtension, Node, RawCommands } from '@tiptap/core'

export type HeadingLevel = 1 | 2 | 3 | 4

/** schema に載せるレベル。既存の見出しを読めるよう常に全レベルを載せる */
export const SUPPORTED_HEADING_LEVELS: readonly HeadingLevel[] = [1, 2, 3, 4]

type HeadingCommand = RawCommands['setHeading']

/**
 * 見出しの「表示できるレベル」と「新しく適用できるレベル」を分ける。
 *
 * 許可レベルを StarterKit の heading.levels（= schema）へ渡すと、許可外のレベルは
 * parseHTML のルールが無くなって段落に落ち、renderHTML も別のレベルへ描き替えるため、
 * 既存の見出しが失われる。schema は全レベルのままにして、操作だけをここで絞る。
 *
 * 拡張の実装は this.options.levels を見るので、表示用の値が入っているそれは参照せず、
 * ショートカットと入力ルールを許可レベルから組み直す。
 */
export const createHeadingOperationLimiter =
  (allowedLevels: readonly HeadingLevel[]) =>
  (extension: AnyExtension): AnyExtension => {
    if (extension.name !== 'heading') return extension

    const isAllowed = (level: unknown) => allowedLevels.includes(level as HeadingLevel)

    // AnyExtension のままだと this.type が null を含む型になるため Node として扱う
    return (extension as Node).extend({
      addCommands() {
        const parent = this.parent?.() as Partial<RawCommands> | undefined

        // 許可外のレベルでは何もせず false を返す。toggle で既存の見出しを段落に変えない
        const limit =
          (command: HeadingCommand | undefined): HeadingCommand =>
          (attributes) =>
          (props) =>
            command !== undefined && isAllowed(attributes.level)
              ? command(attributes)(props)
              : false

        return {
          ...parent,
          setHeading: limit(parent?.setHeading),
          toggleHeading: limit(parent?.toggleHeading),
        }
      },
      addKeyboardShortcuts() {
        const { editor } = this

        return allowedLevels.reduce(
          (shortcuts, level) => ({
            ...shortcuts,
            [`Mod-Alt-${level}`]: () => editor.commands.toggleHeading({ level }),
          }),
          {},
        )
      },
      addInputRules() {
        if (allowedLevels.length === 0) return []

        const minLevel = Math.min(...allowedLevels)

        return allowedLevels.map((level) =>
          textblockTypeInputRule({
            find: new RegExp(`^(#{${minLevel},${level}})\\s$`),
            type: this.type,
            getAttributes: { level },
          }),
        )
      },
    })
  }
