const KATAKANA = /[ァ-ヶ]/g
const KATAKANA_TO_HIRAGANA = 0x60

export const toSearchText = (text: string) =>
  text
    .normalize('NFKC')
    .toLowerCase()
    .replace(KATAKANA, (char) => String.fromCharCode(char.charCodeAt(0) - KATAKANA_TO_HIRAGANA))
