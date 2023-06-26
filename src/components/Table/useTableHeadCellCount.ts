import { useCallback, useState } from 'react'

export const useTableHeadCellCount = <T extends HTMLElement>() => {
  const [count, setCount] = useState(1000)

  const countHeadCellRef = useCallback((node: T) => {
    if (node !== null) {
      const parentTable = node.closest('table')
      const cells = parentTable?.querySelectorAll('thead > tr:first-child > th')
      setCount(cells?.length || 0)
    }
  }, [])

  return { count, countHeadCellRef }
}
