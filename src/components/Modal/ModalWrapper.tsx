import * as React from 'react'

interface State {
  active: boolean
  children?: React.ReactNode[]
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

export class ModalWrapper extends React.PureComponent<{}, State> {
  public state: State = { active: false }

  public render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          showModal: this.show,
          hideModal: this.hide,
          active: this.state.active,
        }}
      >
        {children}
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
