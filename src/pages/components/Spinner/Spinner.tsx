import React from 'react'
import { Cell, Loader, Row } from '../../..'
import styled from 'styled-components'

export const Spinner: React.VFC = () => (
  <Wrapper>
    <Loader />
  </Wrapper>
)

export const SpinnerRow: React.VFC<{ colSpan: number }> = ({ colSpan }) => (
  <Row>
    <Cell colSpan={colSpan}>
      <Spinner />
    </Cell>
  </Row>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space(8)} 0;
`
