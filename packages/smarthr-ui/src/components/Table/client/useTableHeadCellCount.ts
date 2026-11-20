import { useCallback, useState } from 'react'

// HINT: 初期表示のタイミングでBulkActionRowも表示している場合、潰れてみえないよう初期値を大きめに設定しておく
const INITIAL_COUNT = 999

// HINT: colSpan=999 を固定値として使い続けることも視覚的には問題ない（ブラウザが実際のカラム数にクランプして描画するため）。
// ただし、一部のスクリーンリーダーや支援技術（AT）はDOMのcolSpan属性値（999）を直接参照し、
// 「999カラムにまたがる」と誤って告知する実装がある。
// これを防ぐためにa11y対応として実際のheadセル数を取得し、正確なcolSpan値を設定するhookとして実装している。
export const useTableHeadCellCount = <T extends HTMLElement>() => {
  const [count, setCount] = useState(INITIAL_COUNT)

  const countHeadCellRef = useCallback((node: T | null) => {
    if (!node) return

    const table = node.closest('table')
    if (!table) {
      setCount(INITIAL_COUNT)
      return
    }

    let observedHead: HTMLTableSectionElement | null | undefined
    const syncHeader = () => {
      const head = table.tHead
      if (head !== observedHead) {
        observedHead = head
        observer.disconnect()
        // HINT: thead の差し替えは table の直下だけを監視し、tbody 内の更新は監視しない
        observer.observe(table, { childList: true })
        if (head) {
          observer.observe(head, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['colspan'],
          })
        }
      }

      // BulkActionRowのようにthを含まない行が存在する可能性があるため、thを含む最初の行を探す
      for (const row of Array.from(head?.rows ?? [])) {
        const headers = Array.from(row.cells).filter((cell) => cell.tagName === 'TH')
        if (headers.length > 0) {
          const totalColSpan = headers.reduce((sum, th) => sum + (th.colSpan || 1), 0)
          setCount(totalColSpan)
          return
        }
      }

      setCount(INITIAL_COUNT)
    }

    const observer = new MutationObserver(syncHeader)
    syncHeader()

    return () => observer.disconnect()
  }, [])

  return { count, countHeadCellRef }
}
