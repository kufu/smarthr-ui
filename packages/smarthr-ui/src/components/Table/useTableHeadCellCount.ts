import { useCallback, useState } from 'react'

export const useTableHeadCellCount = <T extends HTMLElement>() => {
  const [count, setCount] = useState(0)

  const countHeadCellRef = useCallback((node: T) => {
    if (node !== null) {
      const parentTable = node.closest('table')
      const rows = parentTable?.querySelectorAll('thead > tr')

      if (!rows?.length) {
        setCount(0)
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
