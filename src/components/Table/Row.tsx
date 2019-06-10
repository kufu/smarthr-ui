import * as React from 'react'
import styled from 'styled-components'

const Row: React.FC<{}> = props => {
  return <Wrapper>{props.children}</Wrapper>
}

const Wrapper = styled.tr``

export default Row
