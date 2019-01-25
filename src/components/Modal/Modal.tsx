import * as React from 'react'

import { getParentElementByClassName } from '../../libs/dom'
import { isEqual } from '../../libs/lodash'
import { ModalTrigger } from './ModalTrigger'
import { ModalContent } from './ModalContent'

interface ClickEvent {
  target: HTMLElement
  preventDefault(): void
}

interface Props {
  modalKey: string
  children?: React.ReactNode
}

interface State {
  active: boolean
  children?: Array<React.ComponentType<{}>>
}

export class Modal extends React.PureComponent<Props, State> {
  public state: State = { active: false }

  public componentDidMount() {
    this.setState({ children: this.getChildren() })
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
    return <div className={`Modal ${this.props.modalKey}`}>{this.state.children}</div>
  }

  private getChildren = () => {
    const { active } = this.state

    return React.Children.map(this.props.children, (child: any) => {
      switch (child.type.displayName) {
        case ModalTrigger.displayName:
          return React.cloneElement(child, {
            onClick: this.show,
          })

        case ModalContent.displayName:
          return React.cloneElement(child, {
            active,
            onClick: this.hide,
          })

        default:
          return child
      }
    })
  }

  private hide = (e: ClickEvent) => {
    e.preventDefault()

    if (!getParentElementByClassName(e.target, this.props.modalKey, true)) return

    this.setState({ active: false })
  }

  private show = (e: ClickEvent) => {
    e.preventDefault()
    this.setState({ active: true })
  }
}
