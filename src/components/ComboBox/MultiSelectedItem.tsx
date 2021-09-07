import React, { useCallback, useState } from 'react'

import { Tooltip } from '../Tooltip'
import { Props as InnerProps, MultiSelectedItemInner } from './MultiSelectedItemInner'

type Props<T> = Omit<InnerProps<T>, 'onEllipsis'>

export function MultiSelectedItem<T>(props: Props<T>) {
  const [hasEllipsis, setHasEllipsis] = useState(false)
  const handleEllipsis = useCallback(() => {
    setHasEllipsis(true)
  }, [])

  return props.enableEllipsis && hasEllipsis ? (
    <Tooltip message={props.item.label} multiLine>
      <MultiSelectedItemInner {...props} />
    </Tooltip>
  ) : (
    <MultiSelectedItemInner {...props} onEllipsis={handleEllipsis} />
  )
}
