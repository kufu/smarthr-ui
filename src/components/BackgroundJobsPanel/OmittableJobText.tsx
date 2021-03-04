import React, { VFC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { LightTooltip } from '../Tooltip'

type Props = {
  children: string
  className?: string
}

export const OmittableJobText: VFC<Props> = ({ children, className }) => {
  const [needsOmitting, setNeedsOmitting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setNeedsOmitting(false)
  }, [children])
  useEffect(() => {
    if (!ref.current || needsOmitting) {
      return
    }
    const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } = ref.current
    setNeedsOmitting(offsetWidth < scrollWidth || offsetHeight < scrollHeight)
  }, [needsOmitting, children])

  return (
    <Wrapper ref={ref} className={className}>
      {needsOmitting ? <Tooltip message={children}>{children}</Tooltip> : children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
const Tooltip = styled(LightTooltip)`
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
`
