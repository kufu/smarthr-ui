import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { extendDefaultPropTypes } from '../../libs/propTypes'
import { withTheme, InjectedProps } from '../../hocs/withTheme'
import {
  TableContext,
  TableContextValue,
  SizeType,
  TableCellContext,
  TableCellContextValue,
} from './Table'

const TableConsumer: any = TableContext.Consumer
const CellConsumer: any = TableCellContext.Consumer

interface Props extends React.Props<{}> {
  component?: 'td' | 'th'
  style?: {}
}
type MergedProps = Props & InjectedProps

const getComponent = ({
  component,
  cell,
  theme,
  size,
  style,
  children,
}: MergedProps & TableContextValue & TableCellContextValue): any => {
  const BodyComponent = () => (
    <Body theme={theme} size={size} style={style}>
      {children}
    </Body>
  )
  const HeadComponent = () => (
    <Head theme={theme} size={size} style={style}>
      {children}
    </Head>
  )

  if (component === 'td') return <BodyComponent />
  if (component === 'th') return <HeadComponent />
  if (cell === 'body') return <BodyComponent />
  if (cell === 'head') return <HeadComponent />
}
const TableCell: React.SFC<MergedProps> = ({ component, theme, style = {}, children }) => (
  <TableConsumer>
    {({ size }: TableContextValue) => (
      <CellConsumer>
        {({ cell }: TableCellContextValue) => {
          return getComponent({ component, cell, theme, size, style, children })
        }}
      </CellConsumer>
    )}
  </TableConsumer>
)

TableCell.propTypes = extendDefaultPropTypes<Props>({
  component: PropTypes.oneOf(['td', 'th']),
})

export default withTheme(TableCell)

interface Styles extends InjectedProps {
  size: SizeType
}
const sizeMap = {
  s: {
    padding: '5px',
    fontSize: 12,
  },
  m: {
    padding: '10px',
    fontSize: 14,
  },
  l: {
    padding: '15px',
    fontSize: 16,
  },
}
const Body = styled.td`
  padding: ${({ size }: Styles) => sizeMap[size].padding};
  font-size: ${({ theme, size }: Styles) => theme.typography.pxToRem(sizeMap[size].fontSize)};
`
const Head = styled(Body.withComponent('th'))`
  font-weight: bold;
`
