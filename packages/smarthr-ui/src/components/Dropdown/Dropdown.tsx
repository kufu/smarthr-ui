import * as React from 'react'
import * as PropTypes from 'prop-types'
import styled from 'styled-components'
import * as uuid from 'node-uuid'

import { isEqual } from '../../libs/lodash'
import { getParentElementByClassName } from '../../libs/dom'
import DropdownTrigger from './DropdownTrigger'
import DropdownContent, { Rect } from './DropdownContent'

interface CustomTarget extends EventTarget {
  getBoundingClientRect(): Rect
}
interface ToggleEvenet extends Event {
  currentTarget: CustomTarget
}
interface Props extends React.Props<{}> {}
interface State {
  active: boolean
  clientRect?: Rect
  children?: Array<React.Component<{}>>
}

export default class Dropdown extends React.Component<Props, State> {
  public static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  }
  public dropdownKey = uuid.v4()

  constructor(props: Props) {
    super(props)

    this.state = { active: false }
  }

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

  public hide = (e: { target: HTMLElement }) => {
    if (getParentElementByClassName(e.target, this.dropdownKey, true)) return
    this.setState({ active: false })
  }

  public getChildren = () => {
    const { active, clientRect } = this.state

    return React.Children.map(this.props.children, (child: any) => {
      if (child.type.displayName === DropdownTrigger.displayName) {
        return React.cloneElement(child, {
          dropdownKey: this.dropdownKey,
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

  public handleToggle = (e: ToggleEvenet) => {
    e.preventDefault()

    this.setState({
      active: !this.state.active,
      clientRect: e.currentTarget.getBoundingClientRect(),
    })
  }

  public render() {
    return (
      <Wrapper className={`Dropdown ${this.state.active ? 'active' : ''}`}>
        {this.state.children}
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  position: relative;
`
