import * as React from 'react'
import styled from 'styled-components'

import { Rect } from './DropdownContent'

interface Props {
  children?: React.ReactNode
}

interface State {
  active: boolean
  clientRect?: Rect
}

interface DropdownContext {
  active: boolean
  clientRect?: Rect
  toggleDropdown: (clientRect: Rect) => void
}

const { Consumer, Provider } = React.createContext<DropdownContext>({
  active: false,
  toggleDropdown: (_: Rect) => null,
})

export const DropdownConsumer = Consumer

export class Dropdown extends React.PureComponent<Props, State> {
  public state: State = { active: false }

  public render() {
    return (
      <Provider
        value={{
          active: this.state.active,
          toggleDropdown: this.handleToggle,
          clientRect: this.state.clientRect,
        }}
      >
        <Wrapper className={this.state.active ? 'active' : ''}>{this.props.children}</Wrapper>
      </Provider>
    )
  }

  private handleToggle = (clientRect: Rect) => {
    this.setState({
      active: !this.state.active,
      clientRect,
    })
  }
}

const Wrapper = styled.div`
  position: relative;
`
