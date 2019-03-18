import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Flash } from './Flash'

type FlashType = 'success' | 'danger' | ''

interface State {
  form: {
    type: FlashType
    text: string
  }
  flash: {
    type: FlashType
    text: string
    visible: boolean
  }
}

class WrappedComponent extends React.PureComponent<{}, State> {
  public state = {
    form: {
      type: '' as FlashType,
      text: '',
    },
    flash: {
      type: '' as FlashType,
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
            <option value="danger">danger</option>
          </select>
          <input type="submit" value="フラッシュメッセージを表示する" />
        </Form>

        <Flash {...flash} onClose={this.onClose} />
      </div>
    )
  }

  private onClose = () => {
    this.setState({
      flash: {
        ...this.state.flash,
        visible: false,
      },
    })
  }

  private onChangeText = (e: { currentTarget: { value: string } }) => {
    this.setState({
      form: {
        ...this.state.form,
        text: e.currentTarget.value,
      },
    })
  }

  private onChangeType = (e: { currentTarget: { value: string } }) => {
    this.setState({
      form: {
        ...this.state.form,
        type: e.currentTarget.value as FlashType,
      },
    })
  }

  private onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    this.setState({
      flash: {
        ...this.state.form,
        visible: true,
      },
    })
  }
}

storiesOf('Flash', module).add('all', () => <WrappedComponent />)

const Form = styled.form`
  margin-bottom: 24px;
`
