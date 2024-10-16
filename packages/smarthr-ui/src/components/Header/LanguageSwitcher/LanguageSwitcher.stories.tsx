import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React, { useState } from 'react'

import { LocaleMap } from '../../../types'
import { Stack } from '../../Layout'

import { LanguageSwitcher } from '.'

export default {
  title: 'Navigation（ナビゲーション）/Header/LanguageSwitcher',
  component: LanguageSwitcher,
}

const localeMap: LocaleMap = {
  ja: '日本語',
  'en-us': 'English',
  pt: 'Português',
  vi: 'Tiếng Việt',
  ko: '한국어',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
}

export const All: StoryFn = () => {
  const [currentLang, setLang] = useState<string>('ja')

  const handleLanguageSelect = (code: string) => {
    setLang(code)
    action('onLanguageSelect')
  }

  return (
    <Stack gap={1} as="dl">
      <div>
        <dt>normal</dt>
        <dd className="shr-flex shr-bg-main-darken">
          <LanguageSwitcher
            locale={currentLang}
            localeMap={localeMap}
            onLanguageSelect={handleLanguageSelect}
          />
        </dd>
      </div>

      <div>
        <dt>narrow</dt>
        <dd className="shr-flex shr-bg-main-darken">
          <LanguageSwitcher
            narrow
            locale={currentLang}
            localeMap={localeMap}
            onLanguageSelect={handleLanguageSelect}
            decorators={{ checkIconAlt: () => 'selected' }}
          />
        </dd>
      </div>

      <div>
        <dt>invert & ボタンラベル変更</dt>
        <dd className="shr-flex">
          <LanguageSwitcher
            invert
            locale={currentLang}
            localeMap={localeMap}
            onLanguageSelect={handleLanguageSelect}
            decorators={{ triggerLabel: () => '言語選択' }}
          />
        </dd>
      </div>

      <div>
        <dt>narrow invert & defaultのlocaleを変更</dt>
        <dd className="shr-flex">
          <LanguageSwitcher
            narrow
            invert
            locale={Object.keys(localeMap)[1]}
            localeMap={localeMap}
            onLanguageSelect={handleLanguageSelect}
          />
        </dd>
      </div>
    </Stack>
  )
}
