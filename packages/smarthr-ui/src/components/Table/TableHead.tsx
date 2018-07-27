import * as React from 'react'

import { extendDefaultPropTypes } from '../../libs/propTypes'
import { TableCellContext } from './Table'

const { Provider } = TableCellContext

interface Props extends React.Props<{}> {
  style?: {}
}

const TableHead: React.SFC<Props> = ({ style = {}, children }) => (
  <Provider value={{ cell: 'head' }}>
    <thead style={style}>{children}</thead>
  </Provider>
)

TableHead.propTypes = extendDefaultPropTypes<Props>({})

export default TableHead
