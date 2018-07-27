import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'

import { extendDefaultPropTypes } from '../../libs/propTypes'
import { withTheme, InjectedProps } from '../../hocs/withTheme'

export type SizeType = 's' | 'm' | 'l'
export interface TableContextValue {
  size: SizeType
}
export const TableContext = React.createContext({
  size: 'm',
})
export type CellType = 'head' | 'body'
export interface TableCellContextValue {
  cell: CellType
}
export const TableCellContext = React.createContext({
  cell: 'body',
})
const { Provider } = TableContext

interface Props extends React.Props<{}> {
  size?: SizeType
  style?: {}
}
type MergedProps = Props & InjectedProps

class Table extends React.Component<MergedProps> {
  public static propTypes = extendDefaultPropTypes<MergedProps>({
    size: PropTypes.oneOf(['s', 'm', 'l']),
  })

  public render() {
    const { size = 'm', theme, style = {}, children } = this.props

    return (
      <Provider value={{ size }}>
        <Wrapper theme={theme} style={style}>
          {children}
        </Wrapper>
      </Provider>
    )
  }
}

export default withTheme(Table)

const Wrapper = styled.table`
  width: 100%;
  border-radius: 4px;
  border-collapse: collapse;

  & > thead > tr > th,
  & > thead > tr > td {
    border-bottom: 1px solid #e0e0e0;
    background-color: #fafafa;
  }

  & > tbody > tr > th,
  & > tbody > tr > td {
    background-color: ${({ theme }: InjectedProps) => theme.palette.white};
  }

  & > tbody > tr:not(:last-child) > th,
  & > tbody > tr:not(:last-child) > td {
    border-bottom: 1px solid #e0e0e0;
  }

  & > tbody > tr:nth-child(even) > th,
  & > tbody > tr:nth-child(even) > td {
    background-color: #fafafa;
  }

  & > tbody > tr:hover {
    & > th,
    & > td {
      background-color: rgba(0, 0, 0, 0.07);
    }
  }

  & > thead > tr:first-child > td:first-child,
  & > thead > tr:first-child > th:first-child {
    border-top-left-radius: 4px;
  }
  & > thead > tr:first-child > td:last-child,
  & > thead > tr:first-child > th:last-child {
    border-top-right-radius: 4px;
  }
  & > tbody > tr:last-child > td:first-child,
  & > tbody > tr:last-child > th:first-child {
    border-bottom-left-radius: 4px;
  }
  & > tbody > tr:last-child > td:last-child,
  & > tbody > tr:last-child > th:last-child {
    border-bottom-right-radius: 4px;
  }
`
