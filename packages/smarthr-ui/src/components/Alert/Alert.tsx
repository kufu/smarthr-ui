import * as React from 'react'

import objectAssign from '../../helper/objectAssign'
import { color } from '../../constants/style'

interface Props {
  type: string
  children: string | JSX.Element
}
const Alert: React.SFC<Props> = ({ type, children }) => (
  <div style={getStyle(type)}>{children}</div>
)

export default Alert

const getStyle = (type: string) => {
  let typeStyle = {}

  switch (type) {
    case 'success':
      typeStyle = {
        borderColor: color.success.primary,
        color: color.success.secondary,
      }
      break
    case 'info':
      typeStyle = {
        borderColor: color.info.primary,
        color: color.info.secondary,
      }
      break
    case 'warning':
      typeStyle = {
        borderColor: color.warning.primary,
        color: color.warning.secondary,
      }
      break
    case 'danger':
      typeStyle = {
        borderColor: color.danger.primary,
        color: color.danger.secondary,
      }
      break
    default:
      break
  }

  return objectAssign(
    {
      display: 'inline-block',
      padding: '15px',
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '3px',
      border: '0 solid',
      borderLeftWidth: '10px',
      backgroundColor: color.white,
    },
    typeStyle,
  )
}
