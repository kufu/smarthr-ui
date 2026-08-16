'use client'

import { useIntl } from '../../../../intl'

import { type ColorPaletteEntry, normalizeHex } from './ColorPickerPalette'

type Args = {
  currentColor: string | null
  colors: readonly ColorPaletteEntry[]
  defaultColor: string
  /** currentColor が未設定のときに読み上げるラベル */
  unsetLabel: string
}

/** 標準パレットに無い色は名前を持たないため、hex をそのまま読み上げに載せる */
export const useCurrentColorLabel = ({
  currentColor,
  colors,
  defaultColor,
  unsetLabel,
}: Args): string => {
  const { localize } = useIntl()

  if (currentColor === null) return unsetLabel

  const normalized = normalizeHex(currentColor, defaultColor)
  const matched = colors.find((color) => normalizeHex(color.value, defaultColor) === normalized)

  return matched ? localize({ id: matched.labelId, defaultText: matched.defaultText }) : normalized
}
