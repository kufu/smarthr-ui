import { useEffect, useRef, useState } from 'react'

export const useTableHeadCellCount = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const [count, setCount] = useState(1000)

  useEffect(() => {
    if (ref.current) {
      const parentTable = ref.current.closest('table')
      const cells = parentTable?.querySelectorAll('thead > tr:first-child > th')
      setCount(cells?.length || 0)
    }
  }, [ref])

  return { ref, count }
}
