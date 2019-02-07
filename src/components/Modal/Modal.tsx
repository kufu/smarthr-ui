import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

interface State {
  active: boolean
  children?: Array<React.ComponentType<{}>>
}

interface ModalContext {
  showModal: () => void
  hideModal: () => void
  active: boolean
}

const { Provider, Consumer } = React.createContext<ModalContext>({
  showModal: () => null,
  hideModal: () => null,
  active: false,
})

export const ModalConsumer = Consumer

export class Modal extends React.Component<Props, State> {
  public state: State = { active: false }

  public render() {
    return (
      <Provider value={{ showModal: this.show, hideModal: this.hide, active: this.state.active }}>
        {this.props.children}
      </Provider>
    )
  }

  private hide = () => {
    this.setState({ active: false })
  }

  private show = () => {
    this.setState({ active: true })
  }
}
