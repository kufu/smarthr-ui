import * as React from 'react'
import styled from 'styled-components'

import { isEqual } from '../../libs/lodash'
import { getParentElementByClassName } from '../../libs/dom'
import { DropdownTrigger } from './DropdownTrigger'
import { DropdownContent, Rect } from './DropdownContent'

interface ToggleEvent {
  currentTarget: {
    getBoundingClientRect(): Rect
  }
  preventDefault(): void
}

interface Props {
  dropdownKey: string
  children?: React.ReactNode
}

interface State {
  active: boolean
  clientRect?: Rect
  children?: Array<React.ComponentType<{}>>
}

export class Dropdown extends React.Component<Props, State> {
  public state: State = { active: false }

  public componentDidMount() {
    this.setState({ children: this.getChildren() })
    document.body.addEventListener('click', this.hide as any)
  }

  public componentWillUnmount() {
    document.body.removeEventListener('click', this.hide as any)
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.active !== this.state.active) {
      this.setState({ children: this.getChildren() })
    }

    if (!isEqual(prevProps.children, this.props.children)) {
      this.setState({ children: this.getChildren() })
    }
  }

  public render() {
    return (
      <Wrapper className={`Dropdown ${this.state.active ? 'active' : ''}`}>
        {this.state.children}
      </Wrapper>
    )
  }

  private hide = (e: { target: HTMLElement }) => {
    if (getParentElementByClassName(e.target, this.props.dropdownKey, true)) return
    this.setState({ active: false })
  }

  private getChildren = () => {
    const { active, clientRect } = this.state

    return React.Children.map(this.props.children, (child: any) => {
      if (child.type.displayName === DropdownTrigger.displayName) {
        return React.cloneElement(child, {
          dropdownKey: this.props.dropdownKey,
          active,
          onClick: this.handleToggle,
        })
      }

      if (child.type.displayName === DropdownContent.displayName) {
        return React.cloneElement(child, { active, clientRect })
      }

      return child
    })
  }

  private handleToggle = (e: ToggleEvent) => {
    e.preventDefault()

    this.setState({
      active: !this.state.active,
      clientRect: e.currentTarget.getBoundingClientRect(),
    })
  }
}

const Wrapper = styled.div`
  position: relative;
`
