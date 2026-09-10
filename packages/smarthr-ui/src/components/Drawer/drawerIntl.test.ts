import { locales } from '../../intl'

const KEYS = [
  'smarthr-ui/Drawer/closeButtonIconAlt',
  'smarthr-ui/Drawer/handleAriaLabel',
  'smarthr-ui/Drawer/handleAriaRoleDescription',
  'smarthr-ui/Drawer/handleDescription',
] as const

describe('Drawer i18n', () => {
  it('ja に日本語が入っていること', () => {
    for (const key of KEYS) {
      expect(locales.ja[key as keyof typeof locales.ja]).not.toBe('')
      expect(locales.ja[key as keyof typeof locales.ja]).toBeTruthy()
    }
  })
  it('全ロケールにキーが存在すること（他言語は空文字でも可）', () => {
    for (const locale of Object.values(locales)) {
      for (const key of KEYS) {
        expect(key in locale).toBe(true)
      }
    }
  })
})
