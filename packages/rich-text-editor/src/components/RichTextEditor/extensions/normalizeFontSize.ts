const ROOT_FONT_SIZE_PX = 16
const FONT_SIZE_PATTERN = /^(\d+(?:\.\d+)?)(px|pt|rem)$/
const PX_PER_UNIT = { px: 1, pt: 4 / 3, rem: ROOT_FONT_SIZE_PX } as const

// pt や px を許可リストに足すだけにしないのは、どちらもブラウザのフォントサイズ設定に
// 追従しないため。保存前に rem へ寄せれば、描画時に落ちる単位が残らない。
// em と % は親要素に依存するため換算しない。貼り付けでは見出しや pre の中にも入るため、
// rem と同じ倍率にすると見出しの中の 1em が本文の大きさに縮む。
export const normalizeFontSize = (value: unknown): string | null => {
  if (typeof value !== 'string') return null

  const matched = FONT_SIZE_PATTERN.exec(value.trim().toLowerCase())

  if (!matched) return null

  const [, num, unit] = matched
  const rem =
    Math.round(
      ((Number(num) * PX_PER_UNIT[unit as keyof typeof PX_PER_UNIT]) / ROOT_FONT_SIZE_PX) * 10000,
    ) / 10000

  return rem > 0 ? `${rem}rem` : null
}
