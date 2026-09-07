import { action } from 'storybook/actions'

import { localeMap } from '../../../intl'
import { LanguageSwitcher } from '../LanguageSwitcher'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Header/LanguageSwitcher',
  component: LanguageSwitcher,
  render: (args) => <LanguageSwitcher {...args} />,
  args: {
    localeMap,
  },
  globals: { backgrounds: { value: 'brand' } },
  parameters: {
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

export const Locale: StoryObj<typeof LanguageSwitcher> = {
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
  globals: { backgrounds: { value: 'background' } },
}

export const EnableNew: StoryObj<typeof LanguageSwitcher> = {
  name: 'enableNew',
  render: (args) => <LanguageSwitcher {...args} />,
  args: {
    enableNew: true,
  },
  globals: { backgrounds: { value: 'white' } },
}
