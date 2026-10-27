import { act, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { useEffect, useState } from 'react'

import { IntlProvider } from '../../../intl'
import { FormControl } from '../../FormGroup'

import { Textarea } from './Textarea'

describe('Textarea', () => {
  describe('maxLetters', () => {
    it('defaultValue のみ指定した場合(非制御)、初期表示時点で文字数カウンタが表示される', () => {
      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="Textarea">
              <Textarea name="textarea" defaultValue="テキスト" maxLetters={10} />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      // HINT: LiveRegion は視認用テキストとスクリーンリーダー用テキストの2要素を持ち、
      // 初期表示時は両者が同じ内容になるため getAllByText で取得する
      expect(screen.getAllByText(/あと6文字/)[0]).toBeInTheDocument()
    })

    it('defaultValue のみ指定した場合(非制御)、ユーザー入力で文字数カウンタが更新される', async () => {
      const user = userEvent.setup()

      render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="Textarea">
              <Textarea name="textarea" defaultValue="テキスト" maxLetters={10} />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      await user.type(screen.getByRole('textbox'), '!!')

      expect(screen.getByText(/あと4文字/)).toBeInTheDocument()
    })

    it('value が非同期で更新された場合も、更新後の文字数カウンタが表示される', async () => {
      const Component = () => {
        const [value, setValue] = useState('')

        useEffect(() => {
          const timer = setTimeout(() => {
            setValue('テキスト')
          }, 100)
          return () => clearTimeout(timer)
        }, [])

        return (
          <IntlProvider locale="ja">
            <form>
              <FormControl label="Textarea">
                <Textarea name="textarea" value={value} maxLetters={10} />
              </FormControl>
            </form>
          </IntlProvider>
        )
      }

      const { getByText } = render(<Component />)
      expect(getByText(/最大10文字入力できます/)).toBeInTheDocument()
      await waitFor(() => {
        expect(screen.getByText(/あと6文字/)).toBeInTheDocument()
      })
    })

    it('非制御で入力を変更後、form.reset()を呼ぶと文字数カウンタがdefaultValueの文字数に戻ること', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="Textarea">
              <Textarea name="textarea" defaultValue="テキスト" maxLetters={10} />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      const textarea = screen.getByRole('textbox')

      await user.clear(textarea)
      await user.type(textarea, 'もっと長いテキストを入力してみる')

      expect(screen.getAllByText(/文字オーバー/)[0]).toBeInTheDocument()

      act(() => {
        container.querySelector('form')!.reset()
      })

      expect(textarea).toHaveProperty('value', 'テキスト')
      expect(screen.getAllByText(/あと6文字/)[0]).toBeInTheDocument()
    })

    it('制御時(value指定)は、form.reset()を呼んでも文字数カウンタが変わらないこと', () => {
      const { container } = render(
        <IntlProvider locale="ja">
          <form>
            <FormControl label="Textarea">
              <Textarea name="textarea" value="もっと長いテキストを入力してみる" maxLetters={10} />
            </FormControl>
          </form>
        </IntlProvider>,
      )

      expect(screen.getAllByText(/文字オーバー/)[0]).toBeInTheDocument()

      act(() => {
        container.querySelector('form')!.reset()
      })

      expect(screen.getAllByText(/文字オーバー/)[0]).toBeInTheDocument()
    })
  })
})
