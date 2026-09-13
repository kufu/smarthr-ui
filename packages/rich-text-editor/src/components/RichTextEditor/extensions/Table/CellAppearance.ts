import { Extension } from '@tiptap/core'

import { isSafeColor } from '../../serializers/safeAttributes'

export const CellAppearance = Extension.create({
  name: 'cellAppearance',
  addGlobalAttributes() {
    return [
      {
        types: ['tableCell', 'tableHeader'],
        attributes: Object.fromEntries(
          ['color', 'backgroundColor'].map((name) => [
            name,
            {
              default: null,
              parseHTML: (element: HTMLElement) => {
                const value = element.style[name as 'color' | 'backgroundColor']
                return isSafeColor(value) ? value : null
              },
              renderHTML: (attributes: Record<string, unknown>) =>
                isSafeColor(attributes[name])
                  ? {
                      style: `${name === 'color' ? 'color' : 'background-color'}: ${attributes[name]}`,
                    }
                  : {},
            },
          ]),
        ),
      },
    ]
  },
})
