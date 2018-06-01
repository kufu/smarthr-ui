import React from 'react'
import styled from 'styled-components'

import { color } from '../../constants/style'

const Alert = ({ type, children }) => (
  <Box className={type || 'success'}>{children}</Box>
)

export default Alert

const Box = styled.div`
  display: inline-block;
  padding: 15px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  border: 0 solid;
  border-left-width: 10px;
  background-color: ${color.white};

  &.success {
    border-color: ${color.success.primary};
    color: ${color.success.secondary};
  }
  &.info {
    border-color: ${color.info.primary};
    color: ${color.info.secondary};
  }
  &.warning {
    border-color: ${color.warning.primary};
    color: ${color.warning.secondary};
  }
  &.danger {
    border-color: ${color.danger.primary};
    color: ${color.danger.secondary};
  }
`
