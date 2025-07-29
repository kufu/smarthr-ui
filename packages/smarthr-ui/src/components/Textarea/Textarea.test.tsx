import { render, screen, waitFor } from '@testing-library/react'
import { useEffect, useState } from 'react'

import { IntlProvider } from '../../intl'
import { FormControl } from '../FormControl'

import { Textarea } from './Textarea'

describe('Textarea', () => {
  describe('maxLetters', () => {
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
              <FormControl title="Textarea">
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
  })
})
