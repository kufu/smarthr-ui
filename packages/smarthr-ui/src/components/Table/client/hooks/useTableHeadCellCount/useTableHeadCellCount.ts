import { useCallback, useState } from 'react'

// HINT: 初期表示のタイミングでBulkActionRowも表示している場合、潰れてみえないよう初期値を大きめに設定しておく
const INITIAL_COUNT = 999

// HINT: colSpan=999 を固定値として使い続けることも視覚的には問題ない（ブラウザが実際のカラム数にクランプして描画するため）。
// ただし、一部のスクリーンリーダーや支援技術（AT）はDOMのcolSpan属性値（999）を直接参照し、
// 「999カラムにまたがる」と誤って告知する実装がある。
// これを防ぐためにa11y対応として実際のheadセル数を取得し、正確なcolSpan値を設定するhookとして実装している。
export const useTableHeadCellCount = <T extends HTMLElement>() => {
  const [count, setCount] = useState(INITIAL_COUNT)

  const countHeadCellRef = useCallback((node: T) => {
    if (node !== null) {
      const parentTable = node.closest('table')
      const rows = parentTable?.querySelectorAll('thead > tr')

      if (!rows?.length) {
        setCount(INITIAL_COUNT)
        return
      }

      // BulkActionRowのようにthを含まない行が存在する可能性があるため、thを含む最初の行を探す
      for (let i = 0; i < rows.length; i++) {
        const thList = Array.from(rows[i].querySelectorAll<HTMLTableCellElement>(':scope > th'))
        if (thList.length > 0) {
          const totalColSpan = thList.reduce((sum, th) => sum + (th.colSpan || 1), 0)
          setCount(totalColSpan)
          return
        }
      }
    }
  }, [])

  return { count, countHeadCellRef }
}
