import { defaultColor } from './src/themes/createColor'
import { defaultFontSize, defaultHtmlFontSize } from './src/themes/createFontSize'
import { defaultShadow } from './src/themes/createShadow'
import { createSpacingByChar, primitiveTokens as spacingSizes } from './src/themes/createSpacing'
import { defaultZIndex } from './src/themes/createZIndex'

import type { Config } from 'tailwindcss'

const spacingByChar = createSpacingByChar(defaultHtmlFontSize / 2)

// この preset を各プロダクトでも読み込んでもらう想定
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    backgroundColor: {
      black: defaultColor.GREY_100,
      white: defaultColor.WHITE,
      disabled: defaultColor.GREY_30,
      link: defaultColor.TEXT_LINK,
      background: defaultColor.BACKGROUND,
      column: defaultColor.COLUMN,
      'base-grey': defaultColor.BASE_GREY,
      'over-background': defaultColor.OVER_BACKGROUND,
      head: defaultColor.HEAD,
      'action-background': defaultColor.ACTION_BACKGROUND,
      main: defaultColor.MAIN,
      danger: defaultColor.DANGER,
      'warning-yellow': defaultColor.WARNING_YELLOW,
      overlay: defaultColor.OVERLAY,
      scrim: defaultColor.SCRIM,
      inherit: 'inherit',
      transparent: 'transparent',
    },
    borderColor: {
      DEFAULT: defaultColor.BORDER,
      black: defaultColor.GREY_100,
      white: defaultColor.WHITE,
      grey: defaultColor.GREY_65,
      main: defaultColor.MAIN,
      danger: defaultColor.DANGER,
      disabled: defaultColor.GREY_30,
      inherit: 'inherit',
      transparent: 'transparent',
    },
    borderRadius: {
      none: '0',
      s: '0.25rem',
      m: '0.375rem',
      l: '0.5rem',
      full: '9999px',
    },
    boxShadow: {
      'layer-0': defaultShadow.LAYER0,
      'layer-1': defaultShadow.LAYER1,
      'layer-2': defaultShadow.LAYER2,
      'layer-3': defaultShadow.LAYER3,
      'layer-4': defaultShadow.LAYER4,
      outline: defaultShadow.OUTLINE,
      none: 'none',
    },
    colors: {
      black: defaultColor.GREY_100,
      white: defaultColor.WHITE,
      main: defaultColor.MAIN,
      brand: defaultColor.BRAND,
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
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontSize: {
      '2xs': defaultFontSize.XXS,
      xs: defaultFontSize.XS,
      sm: defaultFontSize.S,
      base: defaultFontSize.M,
      lg: defaultFontSize.L,
      xl: defaultFontSize.XL,
      '2xl': defaultFontSize.XXL,
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
      ...spacingSizes
        .map((size) => ({
          [size]: spacingByChar(size),
        }))
        .reduce((a, c) => Object.assign(a, c), {}),
    },
    stroke: {
      black: defaultColor.GREY_100,
    },
    textColor: {
      black: defaultColor.GREY_100,
      white: defaultColor.WHITE,
      disabled: defaultColor.GREY_30,
      link: defaultColor.TEXT_LINK,
      grey: defaultColor.GREY_65,
      inherit: 'inherit',
      transparent: 'transparent',
    },
    zIndex: {
      auto: 'auto',
      0: '0',
      'fixed-menu': `${defaultZIndex.FIXED_MENU}`,
      'overlap-base': `${defaultZIndex.OVERLAP_BASE}`,
      overlap: `${defaultZIndex.OVERLAP}`,
      'flash-message': `${defaultZIndex.FLASH_MESSAGE}`,
    },
    // 継承するのはこっち。なんかある?
    extend: {},
  },
  corePlugins: {
    preflight: false,
    boxShadowColor: false,
    caretColor: false,
    divideColor: false,
    fontFamily: false,
    placeholderColor: false,
    ringColor: false,
    ringOffsetColor: false,
    textDecorationColor: false,
  },
  plugins: [],
} satisfies Config
