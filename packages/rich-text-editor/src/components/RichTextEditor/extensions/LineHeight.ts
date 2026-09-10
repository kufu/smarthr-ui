import { Extension } from '@tiptap/core'

export const LINE_HEIGHTS = ['1', '1.25', '1.5', '1.75', '2'] as const

export type LineHeightValue = (typeof LINE_HEIGHTS)[number]

const ALLOWED = new Set<string>(LINE_HEIGHTS)

export const isAllowedLineHeight = (value: unknown): value is LineHeightValue =>
  typeof value === 'string' && ALLOWED.has(value)

export type LineHeightOptions = {
  types: string[]
}

declare module '@tiptap/core' {
  // declaration merging が必要なため interface を使用
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

/**
 * 段落・見出しにブロック属性 line-height を付与する自作拡張。
 *
 * 公式 @tiptap/extension-text-style の LineHeight はコマンドが textStyle(span) 固定で
 * ブロック単位にできないため、TextAlign と同じ addGlobalAttributes 構造で自作する。
 * 許可値は LINE_HEIGHTS の allowlist に限定し、不正な style 注入を防ぐ。
 */
export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) =>
              isAllowedLineHeight(element.style.lineHeight) ? element.style.lineHeight : null,
            renderHTML: (attributes) => {
              if (!isAllowedLineHeight(attributes.lineHeight)) {
                return {}
              }

              return { style: `line-height: ${attributes.lineHeight}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ commands }) => {
          if (!isAllowedLineHeight(lineHeight)) {
            return false
          }

          return this.options.types.every((type) => commands.updateAttributes(type, { lineHeight }))
        },
      unsetLineHeight:
        () =>
        ({ commands }) =>
          this.options.types.every((type) => commands.resetAttributes(type, 'lineHeight')),
    }
  },
})
