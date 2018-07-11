import * as React from 'react'

import { color } from '../../constants/style'

type Type = 'success' | 'info' | 'warning' | 'danger'
interface Props {
  type: Type
  children: string | JSX.Element
}

const Alert: React.SFC<Props> = ({ type, children }) => (
  <div style={getStyle(type)}>{children}</div>
)

export default Alert

const getStyle = (type: Type) => {
  const tagStyle = {
    success: {
      borderColor: color.success.primary,
      color: color.success.secondary,
    },
    info: {
      borderColor: color.info.primary,
      color: color.info.secondary,
    },
    warning: {
      borderColor: color.warning.primary,
      color: color.warning.secondary,
    },
    danger: {
      borderColor: color.danger.primary,
      color: color.danger.secondary,
    },
  }

  return {
    display: 'inline-block',
    padding: '15px',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '3px',
    border: '0 solid',
    borderLeftWidth: '10px',
    backgroundColor: color.white,
    ...tagStyle[type],
  }
}
