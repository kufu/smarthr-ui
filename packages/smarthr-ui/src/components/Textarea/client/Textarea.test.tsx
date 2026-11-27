import { act, render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Activity, StrictMode, useEffect, useState } from 'react'

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

    // HINT: LiveRegionのスクリーンリーダー用テキストはannounceDelay後に更新されるため、
    // getAllByTextでは古い値に一致してしまう。textareaのaria-describedbyが参照する視認用テキストで確認する
    it('非制御の場合、StrictModeでも初期表示時点の文字数カウンタがdefaultValueの文字数になる', () => {
      render(
        <StrictMode>
          <IntlProvider locale="ja">
            <form>
              <FormControl label="Textarea">
                <Textarea name="textarea" defaultValue="テキスト" maxLetters={10} />
              </FormControl>
            </form>
          </IntlProvider>
        </StrictMode>,
      )

      expect(screen.getByRole('textbox')).toHaveAccessibleDescription(
        '最大10文字入力できます あと6文字',
      )
    })

    it('非制御の場合、Activityで非表示から再表示しても入力済みの文字数カウンタが維持される', async () => {
      const user = userEvent.setup()
      const Component = ({ mode }: { mode: 'visible' | 'hidden' }) => (
        <IntlProvider locale="ja">
          <Activity mode={mode}>
            <form>
              <FormControl label="Textarea">
                <Textarea name="textarea" defaultValue="テキスト" maxLetters={10} />
              </FormControl>
            </form>
          </Activity>
        </IntlProvider>
      )

      const { rerender } = render(<Component mode="visible" />)

      const textarea = screen.getByRole('textbox')

      await user.type(textarea, '!!')

      expect(textarea).toHaveAccessibleDescription('最大10文字入力できます あと4文字')

      rerender(<Component mode="hidden" />)
      rerender(<Component mode="visible" />)

      expect(textarea).toHaveProperty('value', 'テキスト!!')
      expect(textarea).toHaveAccessibleDescription('最大10文字入力できます あと4文字')
    })

    it('非制御の場合、Activityで非表示中にform.reset()されても、再表示時に文字数カウンタが実際の値に合わせて戻る', async () => {
      const user = userEvent.setup()
      const Component = ({ mode }: { mode: 'visible' | 'hidden' }) => (
        <IntlProvider locale="ja">
          <Activity mode={mode}>
            <form>
              <FormControl label="Textarea">
                <Textarea name="textarea" defaultValue="テキスト" maxLetters={10} />
              </FormControl>
            </form>
          </Activity>
        </IntlProvider>
      )

      const { container, rerender } = render(<Component mode="visible" />)

      const textarea = screen.getByRole('textbox', { hidden: true })

      await user.type(textarea, '!!')

      expect(textarea).toHaveAccessibleDescription('最大10文字入力できます あと4文字')

      rerender(<Component mode="hidden" />)
      // HINT: 非表示中はrefが外れてresetリスナーも外れるため、再表示時にtextareaの実際の値から数え直す必要がある
      act(() => {
        container.querySelector('form')!.reset()
      })
      rerender(<Component mode="visible" />)

      expect(textarea).toHaveProperty('value', 'テキスト')
      expect(textarea).toHaveAccessibleDescription('最大10文字入力できます あと6文字')
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
