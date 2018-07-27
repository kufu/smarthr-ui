import * as React from 'react'

import { extendDefaultPropTypes } from '../../libs/propTypes'
import { TableCellContext } from './Table'

const { Provider } = TableCellContext

interface Props extends React.Props<{}> {
  style?: {}
}

const TableBody: React.SFC<Props> = ({ style = {}, children }) => (
  <Provider value={{ cell: 'body' }}>
    <tbody style={style}>{children}</tbody>
  </Provider>
)

TableBody.propTypes = extendDefaultPropTypes<Props>({})

export default TableBody
