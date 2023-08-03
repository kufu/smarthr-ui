import { defaultColor } from './src/themes/createColor'
import { defaultFontSize } from './src/themes/createFontSize'

import type { Config } from 'tailwindcss'

// この preset を各プロダクトでも読み込んでもらう想定
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
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
    colors: {
      black: defaultColor.TEXT_BLACK,
      white: defaultColor.WHITE,
      disabled: defaultColor.TEXT_DISABLED,
      link: defaultColor.TEXT_LINK,
      background: defaultColor.BACKGROUND,
      column: defaultColor.COLUMN,
      'base-grey': defaultColor.BASE_GREY,
      'over-background': defaultColor.OVER_BACKGROUND,
      head: defaultColor.HEAD,
      border: defaultColor.BORDER,
      'action-background': defaultColor.ACTION_BACKGROUND,
      main: defaultColor.MAIN,
      outline: defaultColor.OUTLINE,
      danger: defaultColor.DANGER,
      warning: defaultColor.WARNING,
      'warning-yellow': defaultColor.WARNING_YELLOW,
      overlay: defaultColor.OVERLAY,
      scrim: defaultColor.SCRIM,
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
    // 継承するのはこっち。なんかある?
    extend: {},
  },
  corePlugins: {
    preflight: false,
    borderColor: false,
  },
  plugins: [],
} satisfies Config

// 必要そうなトークン from Text
// font-style
