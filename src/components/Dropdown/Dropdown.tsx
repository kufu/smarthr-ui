import * as React from 'react'
import styled from 'styled-components'

import { Rect } from './DropdownContent'
import { getParentElementRecursively, getRandomStr } from './helper'

interface Props {
  children?: React.ReactNode
}

interface State {
  active: boolean
  clientRect?: Rect
}

interface DropdownContext {
  keyName: string
  active: boolean
  clientRect?: Rect
  toggleDropdown: (clientRect: Rect) => void
}

const { Consumer, Provider } = React.createContext<DropdownContext>({
  keyName: '',
  active: false,
  toggleDropdown: (_: Rect) => null,
})

export const DropdownConsumer = Consumer

export class Dropdown extends React.PureComponent<Props, State> {
  public state: State = { active: false }
  public keyName = getRandomStr()

  public componentDidMount = () => {
    document.body.addEventListener('click', this.handleClickBody as any)
  }

  public componentWillUnmount() {
    document.body.removeEventListener('click', this.handleClickBody as any)
  }

  public render() {
    return (
      <Provider
        value={{
          keyName: this.keyName,
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
    this.setState(state => ({ active: !state.active, clientRect }))
  }

  private handleClickBody = (e: { target: HTMLElement }) => {
    if (getParentElementRecursively(e.target, this.keyName)) return
    this.setState({ active: false })
  }
}

const Wrapper = styled.div`
  position: relative;
`
