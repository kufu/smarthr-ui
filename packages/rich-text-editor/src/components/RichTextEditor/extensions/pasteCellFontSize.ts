// style まで文字列で見ないのは、手前の属性値に > があると取りこぼすため
const TABLE_CELL_PATTERN = /<t[dh][\s>/]/i

/**
 * エディタの文字サイズは textStyle mark だけが持つ。セルを textStyle の読み込み対象に
 * しないのは、文字色・背景色の属性も同じ要素から読まれ、セルの色が文字の色へ重複するため。
 */
export const wrapCellFontSize = (html: string): string => {
  if (!TABLE_CELL_PATTERN.test(html)) return html

  // template の中身は不活性なので、画像の読み込みやイベントハンドラは動かない
  const template = document.createElement('template')
  template.innerHTML = html

  template.content.querySelectorAll<HTMLTableCellElement>('td, th').forEach((cell) => {
    const { fontSize } = cell.style

    if (!fontSize) return

    const span = document.createElement('span')
    span.style.fontSize = fontSize

    // 末尾の <br> まで包まないのは、貼り付けで捨てられるのがインライン要素以外の末尾にある <br> だけのため
    const trailingBreak = cell.lastChild?.nodeName === 'BR' ? cell.lastChild : null

    // append(...childNodes) にしないのは、子が多いと引数の上限を超えるため
    while (cell.firstChild && cell.firstChild !== trailingBreak) {
      span.appendChild(cell.firstChild)
    }

    cell.insertBefore(span, trailingBreak)
  })

  return template.innerHTML
}
