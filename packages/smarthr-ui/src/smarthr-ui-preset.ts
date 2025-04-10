import { darken } from 'polished'
import { defaultConfig } from 'tailwind-variants'
import plugin from 'tailwindcss/plugin'

import { defaultColor } from './themes/createColor'
import { defaultFontSize, defaultHtmlFontSize } from './themes/createFontSize'
import { defaultShadow } from './themes/createShadow/defaultShadow'
import { createSpacingByChar, primitiveTokens as spacingSizes } from './themes/createSpacing'
import { defaultZIndex } from './themes/createZIndex'

import type { Config } from 'tailwindcss'

defaultConfig.twMergeConfig = {
  prefix: 'shr-',
  classGroups: {
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
    'font-size': [
      {
        text: ['2xs', 'xs', 'sm', 'base', 'lg', 'xl', '2xl', 'inherit'],
      },
    ],
    lineHeight: [
      {
        leading: ['none', 'tight', 'normal', 'loose'],
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
          'flash-message',
          (classPart: string) => /^\[\d+\]$/.test(classPart),
        ],
      },
    ],
    focus: ['focus-indicator', 'focus-indicator--inner'],
  },
}

const spacingByChar = createSpacingByChar(defaultHtmlFontSize / 2)
type Spacing = {
  [key in (typeof spacingSizes)[number]]: string
}
const darkenColor = (color: string, amount: number = 0.05) => darken(amount, color)

// この preset を各プロダクトでも読み込んでもらう想定
export default {
  content: [],
  theme: {
    backgroundColor: ({ theme }) => ({
      black: defaultColor.GREY_100,
      white: defaultColor.WHITE,
      'white-darken': theme('colors.white-darken'),
      background: defaultColor.BACKGROUND,
      border: theme('colors.grey.20'),
      brand: theme('colors.brand'),
      column: defaultColor.COLUMN,
      'column-darken': darkenColor(defaultColor.COLUMN),
      'base-grey': defaultColor.BASE_GREY,
      'over-background': defaultColor.OVER_BACKGROUND,
      head: defaultColor.HEAD,
      'head-darken': darkenColor(defaultColor.HEAD),
      'action-background': defaultColor.ACTION_BACKGROUND,
      main: defaultColor.MAIN,
      'main-darken': theme('colors.main-darken'),
      danger: defaultColor.DANGER,
      'danger-darken': theme('colors.danger-darken'),
      'warning-yellow': defaultColor.WARNING_YELLOW,
      'warning-yellow-darken': theme('colors.warning-yellow-darken'),
      overlay: defaultColor.OVERLAY,
      scrim: defaultColor.SCRIM,
      grey: {
        9: theme('colors.grey.9'),
        '9-darken': darkenColor(theme('colors.grey.9')),
      },
      inherit: 'inherit',
      transparent: 'transparent',
    }),
    borderRadius: {
      none: '0',
      s: '4px',
      m: '6px',
      l: '8px',
      em: '1em',
      full: '9999px',
    },
    boxShadow: {
      'layer-0': defaultShadow.LAYER0,
      'layer-1': defaultShadow.LAYER1,
      'layer-2': defaultShadow.LAYER2,
      'layer-3': defaultShadow.LAYER3,
      'layer-4': defaultShadow.LAYER4,
      outline: defaultShadow.OUTLINE,
      underline: defaultShadow.UNDERLINE,
      'input-hover': defaultShadow.INPUT_HOVER,
      none: 'none',
    },
    colors: {
      black: defaultColor.GREY_100,
      white: defaultColor.WHITE,
      'white-darken': darkenColor(defaultColor.WHITE),
      main: defaultColor.MAIN,
      'main-darken': darkenColor(defaultColor.MAIN),
      link: defaultColor.TEXT_LINK,
      brand: defaultColor.BRAND,
      outline: defaultColor.OUTLINE,
      danger: defaultColor.DANGER,
      'danger-darken': darkenColor(defaultColor.DANGER),
      'warning-yellow': defaultColor.WARNING_YELLOW,
      'warning-yellow-darken': darkenColor(defaultColor.WARNING_YELLOW),
      grey: {
        DEFAULT: defaultColor.GREY_65,
        5: defaultColor.GREY_5,
        6: defaultColor.GREY_6,
        7: defaultColor.GREY_7,
        9: defaultColor.GREY_9,
        20: defaultColor.GREY_20,
        30: defaultColor.GREY_30,
        65: defaultColor.GREY_65,
        100: defaultColor.GREY_100,
      },
      transparency: {
        15: defaultColor.TRANSPARENCY_15,
        30: defaultColor.TRANSPARENCY_30,
        50: defaultColor.TRANSPARENCY_50,
      },
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: {
      inherit: 'inherit',
    },
    fontSize: {
      '2xs': defaultFontSize.XXS,
      xs: defaultFontSize.XS,
      sm: defaultFontSize.S,
      base: defaultFontSize.M,
      lg: defaultFontSize.L,
      xl: defaultFontSize.XL,
      '2xl': defaultFontSize.XXL,
      inherit: 'inherit',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      normal: '1.5',
      loose: '1.75',
    },
    maxWidth: {
      none: 'none',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      fit: 'fit-content',
    },
    outlineColor: {
      DEFAULT: defaultColor.OUTLINE,
    },
    spacing: {
      px: '1px',
      em: '1em',
      ...(spacingSizes
        .map((size) => ({
          [size]: spacingByChar(size),
        }))
        .reduce((a, c) => Object.assign(a, c), {}) as Spacing),
    },
    stroke: {
      black: defaultColor.GREY_100,
    },
    textColor: ({ theme }) => ({
      main: theme('colors.main'),
      black: theme('colors.black'),
      white: theme('colors.white'),
      'white-darken': theme('colors.white-darken'),
      disabled: theme('colors.grey.30'),
      link: theme('colors.link'),
      // ACTION_BACKGROUND とコントラスト比 4.5 を達成するために調整
      'link-darken': darkenColor(theme('colors.link'), 0.062),
      grey: theme('colors.grey.65'),
      danger: theme('colors.danger'),
      'color-inherit': 'inherit',
      transparent: 'transparent',
    }),
    zIndex: {
      auto: 'auto',
      0: '0',
      1: '1',
      'fixed-menu': `${defaultZIndex.FIXED_MENU}`,
      'overlap-base': `${defaultZIndex.OVERLAP_BASE}`,
      overlap: `${defaultZIndex.OVERLAP}`,
      'flash-message': `${defaultZIndex.FLASH_MESSAGE}`,
    },
    extend: {
      aria: {
        'current-page': 'current="page"',
      },
      minHeight: ({ theme }) => ({
        ...theme('spacing'),
      }),
      borderWidth: {
        6: '6px',
      },
      borderColor: ({ theme }) => ({
        default: theme('colors.grey.20'),
        disabled: theme('colors.grey.20 / 50%'),
        darken: darkenColor(theme('colors.grey.20')),
        'high-contrast': theme('colors.grey.100'),
        link: theme('colors.link'),
      }),
      strokeWidth: {
        '0.5': '0.5',
      },
      keyframes: ({ theme }) => ({
        'loader-fade-in': {
          '0%': {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'loader-line-full-unfill-rotate': {
          '12.5%': {
            transform: 'rotate(135deg)',
          },
          '25%': {
            transform: 'rotate(270deg)',
          },
          '37.5%': {
            transform: 'rotate(405deg)',
          },
          '50%': {
            transform: 'rotate(540deg)',
          },
          '62.5%': {
            transform: 'rotate(675deg)',
          },
          '75%': {
            transform: 'rotate(810deg)',
          },
          '87.5%': {
            transform: 'rotate(945deg)',
          },
          to: {
            transform: 'rotate(1080deg)',
          },
        },
        'loader-line1-fade-in-out': {
          '0%': {
            opacity: '1',
          },
          '25%': {
            opacity: '1',
          },
          '26%': {
            opacity: '0',
          },
          '89%': {
            opacity: '0',
          },
          '90%': {
            opacity: '1',
          },
          to: {
            opacity: '1',
          },
        },
        'loader-line2-fade-in-out': {
          '0%': {
            opacity: '0',
          },
          '15%': {
            opacity: '0',
          },
          '25%': {
            opacity: '1',
          },
          '50%': {
            opacity: '1',
          },
          '51%': {
            opacity: '0',
          },
        },
        'loader-line3-fade-in-out': {
          '0%': {
            opacity: '0',
          },
          '40%': {
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '75%': {
            opacity: '1',
          },
          '76%': {
            opacity: '0',
          },
        },
        'loader-line4-fade-in-out': {
          '0%': {
            opacity: '0',
          },
          '65%': {
            opacity: '0',
          },
          '75%': {
            opacity: '1',
          },
          '90%': {
            opacity: '1',
          },
          to: {
            opacity: '0',
          },
        },
        'loader-left-spin': {
          '0%, 100%': { transform: 'rotate(130deg)' },
          '50%': { transform: 'rotate(-5deg)' },
        },
        'loader-right-spin': {
          '0%, 100%': { transform: 'rotate(-130deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        'notification-bar-slide-in': {
          from: {
            opacity: '0',
            /* 1行の場合の高さ分だけスライドさせる */
            transform: `translateY(calc(-1 * calc(${theme('fontSize.base')} * ${theme('lineHeight.tight')} + ${theme('spacing')[1.5]})))`,
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'flash-message-bounce': {
          'from, 20%, 53%, 80%, to': {
            'animation-timing-function': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            transform: 'translate3d(0, 0, 0)',
          },
          '40%, 43%': {
            'animation-timing-function': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -30px, 0)',
          },
          '70%': {
            'animation-timing-function': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -15px, 0)',
          },
          '90%': {
            transform: 'translate3d(0, -4px, 0)',
          },
        },
      }),
    },
  },
  corePlugins: {
    preflight: false,
    boxShadowColor: false,
    caretColor: false,
    divideColor: false,
    placeholderColor: false,
    ringColor: false,
    ringOffsetColor: false,
    textDecorationColor: false,
  },
  plugins: [
    plugin(({ addComponents, addBase, addVariant, theme }) => {
      addComponents({
        /**
         * box-shadow や ring を使った仕組みでは Firefox で欠陥があるため、独自定義している
         * via https://github.com/tailwindlabs/tailwindcss/issues/10226
         */
        '.focus-indicator': {
          outline: 'none',
          isolation: 'isolate',
          boxShadow: `0 0 0 2px ${theme('colors.white')}, 0 0 0 4px ${theme('colors.outline')}`,
        },
        '.focus-indicator--inner': {
          outline: 'none',
          isolation: 'isolate',
          boxShadow: `inset 0 0 0 2px ${theme('colors.outline')}, inset 0 0 0 4px ${theme('colors.white')}`,
        },
        '.border-shorthand': {
          borderWidth: theme('borderWidth.DEFAULT'),
          borderStyle: 'solid',
          borderColor: theme('borderColor.default'),
        },
        '.border-t-shorthand': {
          borderWidth: '0',
          borderTopWidth: theme('borderWidth.DEFAULT'),
          borderTopStyle: 'solid',
          borderTopColor: theme('borderColor.default'),
        },
        '.border-r-shorthand': {
          borderWidth: '0',
          borderRightWidth: theme('borderWidth.DEFAULT'),
          borderRightStyle: 'solid',
          borderRightColor: theme('borderColor.default'),
        },
        '.border-b-shorthand': {
          borderWidth: '0',
          borderBottomWidth: theme('borderWidth.DEFAULT'),
          borderBottomStyle: 'solid',
          borderBottomColor: theme('borderColor.default'),
        },
        '.border-l-shorthand': {
          borderWidth: '0',
          borderLeftWidth: theme('borderWidth.DEFAULT'),
          borderLeftStyle: 'solid',
          borderLeftColor: theme('borderColor.default'),
        },
      })
      addBase({
        body: {
          overflowWrap: 'break-word',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: theme('lineHeight.normal'),
          color: theme('colors.black'),
          // Windows 環境で Yu Gothic が不用意に記号を詰めてしまうのを避ける
          textSpacingTrim: 'space-all',
        },
        'p, dl': {
          marginBlock: 'unset',
        },
        'menu, ul': {
          marginBlock: 'unset',
          paddingInlineStart: 'unset',
        },
        dd: {
          marginInlineStart: 'unset',
        },
        'button, input, textarea, select': {
          fontFamily: 'inherit',
        },
        input: {
          paddingInline: 'unset',
        },
        'input[type=search]': {
          appearance: 'none',
          boxSizing: 'unset',
        },
        textarea: {
          marginInline: 'unset',
        },
        button: {
          // Safari の UA スタイルで margin が設定されているため
          margin: 'unset',
        },
        a: {
          color: 'inherit',
        },
      })
      addVariant('forced-colors', '@media (forced-colors: active)')
    }),
  ],
  prefix: 'shr-',
} satisfies Config
