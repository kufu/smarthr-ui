import { action } from '@storybook/addon-actions'
import React from 'react'

import { backgroundColor } from '../../../themes'
import { LanguageSwitcher } from '../LanguageSwitcher'

import type { Meta, StoryObj } from '@storybook/react'

const localeMap = {
  ja: '日本語',
  'en-us': 'English',
  pt: 'Português',
  vi: 'Tiếng Việt',
  ko: '한국어',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
}

export default {
  title: 'Navigation（ナビゲーション）/Header/LanguageSwitcher',
  component: LanguageSwitcher,
  render: (args) => <LanguageSwitcher {...args} />,
  args: {
    localeMap,
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.brand }],
    },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof LanguageSwitcher>

export const Playground: StoryObj<typeof LanguageSwitcher> = {}

export const LocaleMap: StoryObj<typeof LanguageSwitcher> = {
  name: 'localeMap',
  args: {
    localeMap,
  },
}

export const Loacle: StoryObj<typeof LanguageSwitcher> = {
  name: 'locale',
  args: {
    locale: 'en-us',
  },
}

export const DefaultLocale: StoryObj<typeof LanguageSwitcher> = {
  name: 'defaultLocale',
  args: {
    defaultLocale: 'pt',
  },
}

export const Narrow: StoryObj<typeof LanguageSwitcher> = {
  name: 'narrow',
  args: {
    narrow: true,
  },
}

export const OnLanguageSelect: StoryObj<typeof LanguageSwitcher> = {
  name: 'onLanguageSelect',
  args: {
    onLanguageSelect: action('selected'),
  },
}

export const Invert: StoryObj<typeof LanguageSwitcher> = {
  name: 'invert',
  args: {
    invert: true,
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.background }],
    },
  },
}

export const EnableNew: StoryObj<typeof LanguageSwitcher> = {
  name: 'enableNew',
  render: (args) => <LanguageSwitcher {...args} />,
  args: {
    enableNew: true,
  },
  parameters: {
    backgrounds: {
      values: [{ name: 'light', value: backgroundColor.white }],
    },
  },
}
