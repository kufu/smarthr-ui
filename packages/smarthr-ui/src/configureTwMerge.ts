import { validators } from 'tailwind-merge'
import { defaultConfig } from 'tailwind-variants'

import { defaultWidth } from './themes'

const DEFAULT_WIDTH_KEYS = Object.keys(defaultWidth) as Array<keyof typeof defaultWidth>

defaultConfig.twMergeConfig = {
  prefix: 'shr-',
  classGroups: {
    w: [{ w: [...DEFAULT_WIDTH_KEYS, validators.isArbitraryValue] }],
    basis: [{ basis: [...DEFAULT_WIDTH_KEYS, validators.isArbitraryValue] }],
    boxShadow: [
      {
        shadow: [
          'layer-0',
          'layer-1',
          'layer-2',
          'layer-3',
          'layer-4',
          'outline',
          'underline',
          'input-hover',
          'none',
        ],
      },
    ],
    'border-shorthand': [
      'border-shorthand',
      'border-t-shorthand',
      'border-r-shorthand',
      'border-b-shorthand',
      'border-l-shorthand',
    ],
    fontSize: [
      {
        text: ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', 'inherit'],
      },
    ],
    lineHeight: [
      {
        leading: ['none', 'tight', 'normal', 'loose', '[0]'],
      },
    ],
    zIndex: [
      {
        z: [
          'auto',
          '0',
          '1',
          'fixed-menu',
          'overlap-base',
          'overlap',
          (classPart: string) => /^\[\d+\]$/.test(classPart),
        ],
      },
    ],
    focus: ['focus-indicator', 'focus-indicator--outer', 'focus-indicator-none'],
  },
}
