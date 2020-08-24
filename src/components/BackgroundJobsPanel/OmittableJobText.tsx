import React, { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { LightTooltip } from '../Tooltip'

type Props = {
  children: string
  className?: string
}

export const OmittableJobText: FC<Props> = ({ children, className }) => {
  const [isEllipsis, setIsEllipsis] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }
    const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } = ref.current
    setIsEllipsis(offsetWidth < scrollWidth || offsetHeight < scrollHeight)
  }, [])

  return (
    <Wrapper ref={ref} className={className}>
      {isEllipsis ? <Tooltip message={children}>{children}</Tooltip> : children}
    </Wrapper>
  )
}

const Wrapper = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const Tooltip = styled(LightTooltip)`
  text-overflow: ellipsis;
  overflow: hidden;
`
