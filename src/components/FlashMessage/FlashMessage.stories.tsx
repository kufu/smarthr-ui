import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { FlashMessage } from './FlashMessage'

type FlashMessageType = 'success' | 'info' | 'warning' | 'error' | ''

interface State {
  form: {
    type: FlashMessageType
    text: string
  }
  flash: {
    type: FlashMessageType
    text: string
    visible: boolean
  }
}

class WrappedComponent extends React.PureComponent<Record<string, unknown>, State> {
  public state = {
    form: {
      type: '' as const,
      text: '',
    },
    flash: {
      type: '' as const,
      text: '',
      visible: false,
    },
  }

  public render() {
    const { form, flash } = this.state

    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <input type="text" value={form.text} onChange={this.onChangeText} />
          <select value={form.type} onChange={this.onChangeType}>
            <option value="">選択してください</option>
            <option value="success">success</option>
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="error">error</option>
          </select>
          <input type="submit" value="フラッシュメッセージを表示する" />
        </Form>

        <FlashMessage {...flash} onClose={this.onClose} />
      </div>
    )
  }

  private onClose = () => {
    this.setState((state) => ({ flash: { ...state.flash, visible: false } }))
  }

  private onChangeText = (e: { currentTarget: { value: string } }) => {
    const text = e.currentTarget.value
    this.setState((state) => ({ form: { ...state.form, text } }))
  }

  private onChangeType = (e: { currentTarget: { value: string } }) => {
    const type = e.currentTarget.value as FlashMessageType
    this.setState((state) => ({ form: { ...state.form, type } }))
  }

  private onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    this.setState((state) => ({ flash: { ...state.form, visible: true } }))
  }
}

storiesOf('FlashMessage', module).add('all', () => <WrappedComponent />)

const Form = styled.form`
  margin-bottom: 24px;
`
