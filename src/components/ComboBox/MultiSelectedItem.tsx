import React, { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Tooltip } from '../Tooltip'
import { Props as InnerProps, MultiSelectedItemInner } from './MultiSelectedItemInner'

type Props<T> = Omit<InnerProps<T>, 'onEllipsis'>

export function MultiSelectedItem<T>(props: Props<T>) {
  const [hasEllipsis, setHasEllipsis] = useState(false)
  const handleEllipsis = useCallback(() => {
    setHasEllipsis(true)
  }, [])

  return props.enableEllipsis && hasEllipsis ? (
    <StyledTooltip message={props.item.label} multiLine>
      <MultiSelectedItemInner {...props} />
    </StyledTooltip>
  ) : (
    <MultiSelectedItemInner {...props} onEllipsis={handleEllipsis} />
  )
}

const StyledTooltip = styled(Tooltip)`
  display: block;
`
