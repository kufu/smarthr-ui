import * as React from 'react'

interface State {
  active: boolean
  children?: React.ReactNode[]
}

interface DialogContext {
  showDialog: () => void
  hideDialog: () => void
  active: boolean
}

const { Provider, Consumer } = React.createContext<DialogContext>({
  showDialog: () => null,
  hideDialog: () => null,
  active: false,
})

export const DialogConsumer = Consumer

export class DialogWrapper extends React.PureComponent<{}, State> {
  public state: State = { active: false }

  public render() {
    const { children } = this.props

    return (
      <Provider
        value={{
          showDialog: this.show,
          hideDialog: this.hide,
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
